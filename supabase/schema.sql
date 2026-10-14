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

-- Partner accounts are created by staff, then linked to one verified UMKM.
-- Partners can submit proposed edits; only the review RPC can change the public listing.
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

-- Public bucket objects are publicly readable. Partners may only add new files to their own prefix.
drop policy if exists "partners upload own store images" on storage.objects;
create policy "partners upload own store images" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'catalog' and (storage.foldername(name))[1] = 'partners'
    and (storage.foldername(name))[2] = (select auth.uid())::text
    and not (select public.is_partner_password_setup_pending())
    and exists (select 1 from public.store_owners o where o.user_id = (select auth.uid()))
  );

-- Setelah membuat pengguna lewat Authentication > Users, berikan akses admin:
-- insert into public.admin_users (user_id, email)
-- select id, email from auth.users where lower(email) = lower('alamat-admin@contoh.id');
