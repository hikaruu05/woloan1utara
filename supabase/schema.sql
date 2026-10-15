-- Jalankan seluruh berkas ini melalui Supabase Dashboard > SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

create or replace function public.is_portal_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.admin_users a where a.user_id = (select auth.uid()));
$$;

create table if not exists public.houses (
  id uuid primary key default gen_random_uuid(), payload jsonb not null,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.stores (
  id uuid primary key default gen_random_uuid(), payload jsonb not null,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.destinations (
  id uuid primary key default gen_random_uuid(), payload jsonb not null,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;
alter table public.houses enable row level security;
alter table public.stores enable row level security;
alter table public.destinations enable row level security;

drop policy if exists "admin can read own membership" on public.admin_users;
create policy "admin can read own membership" on public.admin_users
  for select to authenticated using (user_id = (select auth.uid()));
grant select on public.admin_users to authenticated;

do $$
declare table_name text;
begin
  foreach table_name in array array['houses','stores','destinations'] loop
    execute format('drop policy if exists "public reads published %1$s" on public.%1$I', table_name);
    execute format('create policy "public reads published %1$s" on public.%1$I for select to anon, authenticated using (status = ''published'')', table_name);
    execute format('drop policy if exists "admins manage %1$s" on public.%1$I', table_name);
    execute format('create policy "admins manage %1$s" on public.%1$I for all to authenticated using ((select public.is_portal_admin())) with check ((select public.is_portal_admin()))', table_name);
    execute format('grant select on public.%1$I to anon, authenticated', table_name);
    execute format('grant insert, update, delete on public.%1$I to authenticated', table_name);
  end loop;
end $$;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('catalog', 'catalog', true, 1500000, array['image/webp'])
on conflict (id) do update set public = true, file_size_limit = 1500000, allowed_mime_types = array['image/webp'];

drop policy if exists "public reads catalog images" on storage.objects;
create policy "public reads catalog images" on storage.objects
  for select to anon, authenticated using (bucket_id = 'catalog');
drop policy if exists "admins upload catalog images" on storage.objects;
create policy "admins upload catalog images" on storage.objects
  for insert to authenticated with check (bucket_id = 'catalog' and (select public.is_portal_admin()));
drop policy if exists "admins update catalog images" on storage.objects;
create policy "admins update catalog images" on storage.objects
  for update to authenticated using (bucket_id = 'catalog' and (select public.is_portal_admin()))
  with check (bucket_id = 'catalog' and (select public.is_portal_admin()));
drop policy if exists "admins delete catalog images" on storage.objects;
create policy "admins delete catalog images" on storage.objects
  for delete to authenticated using (bucket_id = 'catalog' and (select public.is_portal_admin()));

-- Legacy UMKM account tables are retained for compatibility; active portal access
-- uses partner_accounts and partner_submissions for all three catalog types.
create table if not exists public.store_owners (
  store_id uuid primary key references public.stores(id) on delete cascade,
  user_id uuid not null unique references auth.users(id) on delete cascade,
  must_change_password boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.store_owners add column if not exists must_change_password boolean not null default false;

create table if not exists public.store_submissions (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  payload jsonb not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  review_note text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id) on delete set null,
  constraint store_submission_payload_id_matches check ((payload->>'id') = store_id::text)
);
create index if not exists store_submissions_store_created_idx on public.store_submissions (store_id, created_at desc);
create unique index if not exists one_pending_submission_per_store on public.store_submissions (store_id) where status = 'pending';

alter table public.store_owners enable row level security;
alter table public.store_submissions enable row level security;

create or replace function public.is_store_owner(target_store_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.store_owners o
    where o.store_id = target_store_id and o.user_id = (select auth.uid())
  );
$$;
create or replace function public.is_partner_password_setup_pending()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.store_owners o
    where o.user_id = (select auth.uid()) and o.must_change_password
  );
$$;
revoke all on function public.is_store_owner(uuid) from public, anon;
grant execute on function public.is_store_owner(uuid) to authenticated;
revoke all on function public.is_partner_password_setup_pending() from public, anon;
grant execute on function public.is_partner_password_setup_pending() to authenticated;

drop policy if exists "owners read own store link" on public.store_owners;
create policy "owners read own store link" on public.store_owners
  for select to authenticated using (user_id = (select auth.uid()) or (select public.is_portal_admin()));
drop policy if exists "admins manage store links" on public.store_owners;
create policy "admins manage store links" on public.store_owners
  for all to authenticated using ((select public.is_portal_admin())) with check ((select public.is_portal_admin()));
grant select on public.store_owners to authenticated;
grant insert, update, delete on public.store_owners to authenticated;

drop policy if exists "owners read own store" on public.stores;
create policy "owners read own store" on public.stores
  for select to authenticated using ((select public.is_store_owner(id)));

drop policy if exists "owners read own submissions" on public.store_submissions;
create policy "owners read own submissions" on public.store_submissions
  for select to authenticated using ((select public.is_store_owner(store_id)) and user_id = (select auth.uid()));
drop policy if exists "owners submit own store changes" on public.store_submissions;
create policy "owners submit own store changes" on public.store_submissions
  for insert to authenticated with check (
    user_id = (select auth.uid()) and (select public.is_store_owner(store_id))
    and not (select public.is_partner_password_setup_pending())
    and status = 'pending' and reviewed_at is null and reviewed_by is null
  );
drop policy if exists "admins manage store submissions" on public.store_submissions;
create policy "admins manage store submissions" on public.store_submissions
  for all to authenticated using ((select public.is_portal_admin())) with check ((select public.is_portal_admin()));
revoke all on public.store_submissions from anon, authenticated;
grant select, insert on public.store_submissions to authenticated;

create or replace function public.approve_store_submission(p_submission_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare submission public.store_submissions%rowtype;
begin
  if not (select public.is_portal_admin()) then raise exception 'Akses petugas diperlukan.' using errcode = '42501'; end if;
  select * into submission from public.store_submissions where id = p_submission_id for update;
  if not found or submission.status <> 'pending' then raise exception 'Pengajuan tidak ditemukan atau sudah ditinjau.' using errcode = 'P0002'; end if;
  update public.stores set payload = submission.payload, status = 'published', updated_at = now() where id = submission.store_id;
  update public.store_submissions set status = 'approved', reviewed_at = now(), reviewed_by = (select auth.uid()), review_note = null where id = p_submission_id;
end;
$$;

create or replace function public.reject_store_submission(p_submission_id uuid, p_review_note text default '')
returns void language plpgsql security definer set search_path = '' as $$
begin
  if not (select public.is_portal_admin()) then raise exception 'Akses petugas diperlukan.' using errcode = '42501'; end if;
  update public.store_submissions
  set status = 'rejected', reviewed_at = now(), reviewed_by = (select auth.uid()),
      review_note = left(coalesce(p_review_note, ''), 1000)
  where id = p_submission_id and status = 'pending';
  if not found then raise exception 'Pengajuan tidak ditemukan atau sudah ditinjau.' using errcode = 'P0002'; end if;
end;
$$;
revoke all on function public.approve_store_submission(uuid) from public, anon;
revoke all on function public.reject_store_submission(uuid, text) from public, anon;
grant execute on function public.approve_store_submission(uuid) to authenticated;
grant execute on function public.reject_store_submission(uuid, text) to authenticated;

create table if not exists public.partner_accounts (
  user_id uuid primary key references auth.users(id) on delete cascade,
  listing_kind text not null check (listing_kind in ('houses','stores','destinations')),
  listing_id uuid not null,
  login_username text,
  must_change_password boolean not null default true,
  created_at timestamptz not null default now(),
  unique (listing_kind, listing_id)
);
alter table public.partner_accounts alter column listing_id drop not null;
alter table public.partner_accounts add column if not exists login_username text;
create unique index if not exists partner_accounts_login_username_unique on public.partner_accounts (lower(login_username)) where login_username is not null;
insert into public.partner_accounts(user_id, listing_kind, listing_id, must_change_password)
select user_id, 'stores', store_id, must_change_password from public.store_owners
on conflict (user_id) do nothing;
-- Remove legacy ownership links after migration so their older RLS policies
-- cannot continue granting access after a partner link is revoked.
delete from public.store_owners;

-- Used only by the service-role Edge Function to reconnect an Auth user after
-- an admin removes a partner listing link. Never expose this lookup to clients.
create or replace function public.lookup_auth_user_id_by_email(target_email text)
returns uuid language sql stable security definer set search_path = '' as $$
  select u.id from auth.users u where lower(u.email) = lower(target_email) limit 1;
$$;
revoke all on function public.lookup_auth_user_id_by_email(text) from public, anon, authenticated;
grant execute on function public.lookup_auth_user_id_by_email(text) to service_role;

create table if not exists public.partner_submissions (
  id uuid primary key default gen_random_uuid(),
  listing_kind text not null check (listing_kind in ('houses','stores','destinations')),
  listing_id uuid not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  payload jsonb not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  review_note text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id) on delete set null,
  constraint partner_submission_payload_id_matches check ((payload->>'id') = listing_id::text)
);
create index if not exists partner_submissions_listing_created_idx on public.partner_submissions (listing_kind, listing_id, created_at desc);
create unique index if not exists one_pending_partner_submission_per_listing on public.partner_submissions (listing_kind, listing_id) where status = 'pending';

-- Do not leave active partner accounts pointing to a missing listing. Linked
-- listings must be unlinked before deletion or archiving.
create or replace function public.guard_partner_listing_lifecycle()
returns trigger language plpgsql security definer set search_path = '' as $$
declare v_listing_kind text := TG_TABLE_NAME;
begin
  if TG_OP = 'DELETE' then
    if exists (select 1 from public.partner_accounts a where a.listing_kind = v_listing_kind and a.listing_id = OLD.id) then
      raise exception 'Listing ini masih terhubung ke akun mitra. Cabut tautan akun sebelum menghapus listing.' using errcode = '23503';
    end if;
    delete from public.partner_submissions s where s.listing_kind = v_listing_kind and s.listing_id = OLD.id;
    return OLD;
  end if;
  if NEW.status = 'archived' and OLD.status <> 'archived'
     and exists (select 1 from public.partner_accounts a where a.listing_kind = v_listing_kind and a.listing_id = NEW.id) then
    raise exception 'Listing ini masih dikelola akun mitra. Cabut tautan akun sebelum mengarsipkan listing.' using errcode = '23514';
  end if;
  return NEW;
end;
$$;
revoke all on function public.guard_partner_listing_lifecycle() from public, anon, authenticated;
drop trigger if exists guard_partner_house_lifecycle on public.houses;
create trigger guard_partner_house_lifecycle before update of status or delete on public.houses for each row execute function public.guard_partner_listing_lifecycle();
drop trigger if exists guard_partner_store_lifecycle on public.stores;
create trigger guard_partner_store_lifecycle before update of status or delete on public.stores for each row execute function public.guard_partner_listing_lifecycle();
drop trigger if exists guard_partner_destination_lifecycle on public.destinations;
create trigger guard_partner_destination_lifecycle before update of status or delete on public.destinations for each row execute function public.guard_partner_listing_lifecycle();

alter table public.partner_accounts enable row level security;
alter table public.partner_submissions enable row level security;

create or replace function public.is_partner_owner(target_kind text, target_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.partner_accounts a where a.user_id = (select auth.uid()) and a.listing_kind = target_kind and a.listing_id = target_id);
$$;
create or replace function public.is_partner_password_setup_pending()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.partner_accounts a where a.user_id = (select auth.uid()) and a.must_change_password);
$$;
revoke all on function public.is_partner_owner(text, uuid) from public, anon;
grant execute on function public.is_partner_owner(text, uuid) to authenticated;
revoke all on function public.is_partner_password_setup_pending() from public, anon;
grant execute on function public.is_partner_password_setup_pending() to authenticated;

drop policy if exists "partners read own account" on public.partner_accounts;
create policy "partners read own account" on public.partner_accounts for select to authenticated using (user_id = (select auth.uid()) or (select public.is_portal_admin()));
drop policy if exists "admins manage partner accounts" on public.partner_accounts;
create policy "admins manage partner accounts" on public.partner_accounts for all to authenticated using ((select public.is_portal_admin())) with check ((select public.is_portal_admin()));
grant select on public.partner_accounts to authenticated;
grant insert, update, delete on public.partner_accounts to authenticated;

do $$
declare table_name text;
begin
  foreach table_name in array array['houses','stores','destinations'] loop
    execute format('drop policy if exists "partners read own %1$s" on public.%1$I', table_name);
    execute format('create policy "partners read own %1$s" on public.%1$I for select to authenticated using ((select public.is_partner_owner(''%1$s'', id)))', table_name);
  end loop;
end $$;

drop policy if exists "partners read own submissions" on public.partner_submissions;
create policy "partners read own submissions" on public.partner_submissions for select to authenticated
  using (user_id = (select auth.uid()) and (select public.is_partner_owner(listing_kind, listing_id)));
drop policy if exists "partners submit listing changes" on public.partner_submissions;
create policy "partners submit listing changes" on public.partner_submissions for insert to authenticated with check (
  user_id = (select auth.uid()) and (select public.is_partner_owner(listing_kind, listing_id))
  and not (select public.is_partner_password_setup_pending()) and status = 'pending'
  and reviewed_at is null and reviewed_by is null
);
drop policy if exists "admins manage partner submissions" on public.partner_submissions;
create policy "admins manage partner submissions" on public.partner_submissions for all to authenticated using ((select public.is_portal_admin())) with check ((select public.is_portal_admin()));
revoke all on public.partner_submissions from anon, authenticated;
grant select, insert on public.partner_submissions to authenticated;

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
create or replace function public.reject_partner_submission(p_submission_id uuid, p_review_note text default '')
returns void language plpgsql security definer set search_path = '' as $$
begin
  if not (select public.is_portal_admin()) then raise exception 'Akses petugas diperlukan.' using errcode = '42501'; end if;
  update public.partner_submissions set status = 'rejected', reviewed_at = now(), reviewed_by = (select auth.uid()), review_note = left(coalesce(p_review_note, ''), 1000)
  where id = p_submission_id and status = 'pending';
  if not found then raise exception 'Pengajuan tidak ditemukan atau sudah ditinjau.' using errcode = 'P0002'; end if;
end;
$$;
revoke all on function public.approve_partner_submission(uuid) from public, anon;
revoke all on function public.reject_partner_submission(uuid, text) from public, anon;
grant execute on function public.approve_partner_submission(uuid) to authenticated;
grant execute on function public.reject_partner_submission(uuid, text) to authenticated;

-- A newly provisioned partner account has a catalog type but no listing.
-- The partner creates the first draft; its initial submission remains pending
-- until an administrator approves it.
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

-- Public bucket objects are publicly readable. Partners may only add new files to their own prefix.
drop policy if exists "partners upload own store images" on storage.objects;
create policy "partners upload own store images" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'catalog' and (storage.foldername(name))[1] = 'partners'
    and (storage.foldername(name))[2] = (select auth.uid())::text
    and not (select public.is_partner_password_setup_pending())
    and exists (select 1 from public.partner_accounts o where o.user_id = (select auth.uid()))
  );

-- Setelah membuat pengguna lewat Authentication > Users, berikan akses admin:
-- insert into public.admin_users (user_id, email)
-- select id, email from auth.users where lower(email) = lower('alamat-admin@contoh.id');

-- Called only by the admin-checked Edge Function, never directly by browsers.
-- One transaction preserves catalog images and removes Auth + partner access.
create or replace function public.delete_partner_auth_user(p_user_id uuid)
returns boolean language plpgsql security definer set search_path = '' as $$
declare
  account public.partner_accounts%rowtype;
begin
  if exists (select 1 from public.admin_users where user_id = p_user_id) then
    raise exception 'Akun administrator tidak dapat dihapus melalui pengelolaan mitra.' using errcode = '42501';
  end if;
  select * into account from public.partner_accounts where user_id = p_user_id for update;
  if not found then
    if not exists (select 1 from auth.users where id = p_user_id) then return false; end if;
    raise exception 'Akun ini bukan akun mitra.' using errcode = '42501';
  end if;
  if account.listing_id is not null then
    raise exception 'Cabut tautan listing sebelum menghapus akun mitra.' using errcode = '23514';
  end if;
  -- Keep published and draft photo URLs intact. Clearing ownership is not deleting
  -- the object; access remains governed by the existing catalog RLS policies.
  if exists (select 1 from information_schema.columns where table_schema = 'storage' and table_name = 'objects' and column_name = 'owner') then
    execute 'update storage.objects set owner_id = null, owner = null where bucket_id = ''catalog'' and (owner_id = $1::text or owner = $1)' using p_user_id;
  else
    update storage.objects set owner_id = null where bucket_id = 'catalog' and owner_id = p_user_id::text;
  end if;
  -- Foreign keys cascade to partner_accounts, submissions, sessions, and identities.
  -- If any constraint fails, the ownership update is rolled back as well.
  delete from auth.users where id = p_user_id;
  return true;
end;
$$;
revoke all on function public.delete_partner_auth_user(uuid) from public, anon, authenticated;
grant execute on function public.delete_partner_auth_user(uuid) to service_role;
