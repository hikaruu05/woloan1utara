begin;

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

commit;
