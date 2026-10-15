-- Admin/mitra review guards and first-listing defaults. Apply after the existing partner schema.
begin;

create or replace function public.approve_partner_submission(p_submission_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare
  submission public.partner_submissions%rowtype;
  listing_status text;
begin
  if not (select public.is_portal_admin()) then raise exception 'Akses petugas diperlukan.' using errcode = '42501'; end if;
  select * into submission from public.partner_submissions where id = p_submission_id;
  if not found then raise exception 'Pengajuan tidak ditemukan.' using errcode = 'P0002'; end if;
  -- Lock the account before the submission, matching the unlink trigger's lock order.
  perform 1 from public.partner_accounts a where a.user_id = submission.user_id
    and a.listing_kind = submission.listing_kind and a.listing_id = submission.listing_id for update;
  if not found then raise exception 'Tautan akun mitra telah dicabut. Pengajuan ini tidak dapat diterbitkan.' using errcode = '42501'; end if;
  select * into submission from public.partner_submissions where id = p_submission_id for update;
  if not found or submission.status <> 'pending' then raise exception 'Pengajuan tidak ditemukan atau sudah ditinjau.' using errcode = 'P0002'; end if;
  if submission.listing_kind = 'houses' then select status into listing_status from public.houses where id = submission.listing_id;
  elsif submission.listing_kind = 'stores' then select status into listing_status from public.stores where id = submission.listing_id;
  elsif submission.listing_kind = 'destinations' then select status into listing_status from public.destinations where id = submission.listing_id;
  else raise exception 'Jenis katalog tidak valid.' using errcode = '22023'; end if;
  if listing_status is null then raise exception 'Listing sudah tidak tersedia.' using errcode = 'P0002'; end if;
  if listing_status = 'archived' then raise exception 'Pulihkan listing sebagai draf sebelum menyetujui pengajuan.' using errcode = '23514'; end if;
  if submission.listing_kind = 'houses' then update public.houses set payload = submission.payload, status = 'published', updated_at = now() where id = submission.listing_id;
  elsif submission.listing_kind = 'stores' then update public.stores set payload = submission.payload, status = 'published', updated_at = now() where id = submission.listing_id;
  elsif submission.listing_kind = 'destinations' then update public.destinations set payload = submission.payload, status = 'published', updated_at = now() where id = submission.listing_id;
  else raise exception 'Jenis katalog tidak valid.' using errcode = '22023'; end if;
  update public.partner_submissions set status = 'approved', reviewed_at = now(), reviewed_by = (select auth.uid()), review_note = null where id = p_submission_id;
end;
$$;
revoke all on function public.approve_partner_submission(uuid) from public, anon;
grant execute on function public.approve_partner_submission(uuid) to authenticated;

create or replace function public.create_partner_listing_submission(p_payload jsonb)
returns uuid language plpgsql security definer set search_path = '' as $$
declare
  account public.partner_accounts%rowtype;
  new_listing_id uuid := gen_random_uuid();
  normalized_payload jsonb;
  listing_name text;
begin
  if (select auth.uid()) is null then raise exception 'Sesi mitra diperlukan.' using errcode = '42501'; end if;
  if p_payload is null or jsonb_typeof(p_payload) <> 'object' then raise exception 'Data listing tidak valid.' using errcode = '22023'; end if;
  select * into account from public.partner_accounts where user_id = (select auth.uid()) for update;
  if not found then raise exception 'Akun ini bukan akun mitra.' using errcode = '42501'; end if;
  if account.must_change_password then raise exception 'Ganti kata sandi sementara sebelum membuat listing.' using errcode = '42501'; end if;
  if account.listing_id is not null then raise exception 'Akun mitra ini sudah memiliki listing.' using errcode = '23505'; end if;
  listing_name := btrim(coalesce(p_payload->>'name', p_payload->>'title', ''));
  if listing_name = '' then raise exception 'Nama listing wajib diisi.' using errcode = '22023'; end if;
  if account.listing_kind = 'stores' then
    if coalesce(jsonb_typeof(p_payload->'products') <> 'array', true) then
      raise exception 'Data produk tidak valid.' using errcode = '22023';
    end if;
    if jsonb_array_length(p_payload->'products') = 0 then
      raise exception 'Tambahkan minimal satu produk sebelum mengirim usaha.' using errcode = '22023';
    end if;
  end if;
  normalized_payload := p_payload || jsonb_build_object('id', new_listing_id, 'isVerified', false, 'createdAt', to_char(now(), 'YYYY-MM-DD'));
  if account.listing_kind = 'houses' then
    insert into public.houses(id, payload, status) values (new_listing_id, normalized_payload, 'draft');
  elsif account.listing_kind = 'stores' then
    insert into public.stores(id, payload, status) values (new_listing_id, normalized_payload, 'draft');
  elsif account.listing_kind = 'destinations' then
    insert into public.destinations(id, payload, status) values (new_listing_id, normalized_payload, 'draft');
  else raise exception 'Jenis katalog akun tidak valid.' using errcode = '22023'; end if;
  update public.partner_accounts set listing_id = new_listing_id where user_id = (select auth.uid());
  insert into public.partner_submissions(listing_kind, listing_id, user_id, payload, status)
  values (account.listing_kind, new_listing_id, (select auth.uid()), normalized_payload, 'pending');
  return new_listing_id;
end;
$$;
revoke all on function public.create_partner_listing_submission(jsonb) from public, anon;
grant execute on function public.create_partner_listing_submission(jsonb) to authenticated;

-- Old pending submissions must not overwrite a listing after ownership changes.
create or replace function public.close_unlinked_partner_submissions()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if OLD.listing_id is not null and
    (NEW.listing_id is distinct from OLD.listing_id or NEW.listing_kind is distinct from OLD.listing_kind) then
    update public.partner_submissions set status = 'rejected', reviewed_at = now(),
      reviewed_by = (select auth.uid()), review_note = 'Tautan akun mitra telah dicabut oleh petugas.'
    where user_id = OLD.user_id and listing_kind = OLD.listing_kind and listing_id = OLD.listing_id and status = 'pending';
  end if;
  return NEW;
end;
$$;
revoke all on function public.close_unlinked_partner_submissions() from public, anon, authenticated;
drop trigger if exists close_unlinked_partner_submissions on public.partner_accounts;
create trigger close_unlinked_partner_submissions after update of listing_id, listing_kind on public.partner_accounts
for each row execute function public.close_unlinked_partner_submissions();

-- Apply the same minimum shape checks to first listings and subsequent edits.
-- Locking the account also prevents a submission racing with an unlink operation.
create or replace function public.validate_partner_submission()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  account public.partner_accounts%rowtype;
  field_name text;
  required_fields text[];
  product jsonb;
begin
  select * into account from public.partner_accounts where user_id = NEW.user_id for update;
  if not found or account.listing_kind <> NEW.listing_kind or account.listing_id is distinct from NEW.listing_id then
    raise exception 'Listing tidak terhubung ke akun mitra.' using errcode = '42501';
  end if;
  if account.must_change_password then raise exception 'Ganti kata sandi sementara sebelum mengirim listing.' using errcode = '42501'; end if;
  if NEW.payload is null or jsonb_typeof(NEW.payload) <> 'object' then raise exception 'Data listing tidak valid.' using errcode = '22023'; end if;
  required_fields := case NEW.listing_kind
    when 'stores' then array['name','ownerName','category','phone','address']
    when 'houses' then array['title','type','craftsmanName','craftsmanPhone','craftsmanAddress']
    else array['name','category','address'] end;
  foreach field_name in array required_fields loop
    if jsonb_typeof(NEW.payload->field_name) is distinct from 'string' or btrim(NEW.payload->>field_name) = '' then
      raise exception 'Lengkapi informasi utama listing: %.', field_name using errcode = '22023';
    end if;
  end loop;
  foreach field_name in array array['woodTypes','features','facilities','activities','galleryUrls'] loop
    if NEW.payload ? field_name and jsonb_typeof(NEW.payload->field_name) <> 'array' then
      raise exception 'Format daftar % tidak valid.', field_name using errcode = '22023';
    end if;
  end loop;
  if NEW.listing_kind = 'stores' then
    if jsonb_typeof(NEW.payload->'products') is distinct from 'array' then raise exception 'Data produk tidak valid.' using errcode = '22023'; end if;
    if jsonb_array_length(NEW.payload->'products') = 0 then raise exception 'Tambahkan minimal satu produk.' using errcode = '22023'; end if;
    for product in select value from jsonb_array_elements(NEW.payload->'products') loop
      if jsonb_typeof(product) <> 'object' or coalesce(btrim(product->>'name'), '') = '' then
        raise exception 'Nama setiap produk wajib diisi.' using errcode = '22023';
      end if;
    end loop;
  end if;
  NEW.payload := NEW.payload || jsonb_build_object('id', NEW.listing_id, 'isVerified', false);
  return NEW;
end;
$$;
revoke all on function public.validate_partner_submission() from public, anon, authenticated;
drop trigger if exists validate_partner_submission on public.partner_submissions;
create trigger validate_partner_submission before insert on public.partner_submissions
for each row execute function public.validate_partner_submission();


commit;
