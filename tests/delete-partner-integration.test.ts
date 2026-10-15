// @vitest-environment node
// Real frontend request -> checked-in Edge handler -> real SQL transaction.
// The SDK transport/Auth identity are adapted locally; no Supabase network calls.
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { deletePartnerAccount } from '../src/services/supabase';
import { loadFunction } from './helpers/load-edge-function';

const admin = '00000000-0000-4000-8000-000000000001';
const target = '00000000-0000-4000-8000-000000000010';
const session = { access_token: 'local-admin', refresh_token: 'local-refresh', expires_at: Date.now() + 3600000, user: { id: admin } };
let db: PGlite;
let handler: (request: Request) => Promise<Response>;
let rpcCalls = 0;
const migrationUrl = new URL('../supabase/migrations/202610150002_delete_partner_account.sql', import.meta.url);

beforeAll(async () => {
  db = new PGlite();
  await db.exec(`
    create role anon; create role authenticated; create role service_role;
    create schema auth; create schema storage;
    create table auth.users(id uuid primary key);
    create table auth.sessions(user_id uuid references auth.users(id) on delete cascade);
    create table public.admin_users(user_id uuid primary key references auth.users(id));
    create table public.stores(id uuid primary key, payload jsonb);
    create table public.partner_accounts(user_id uuid primary key references auth.users(id) on delete cascade, listing_id uuid references public.stores(id));
    create table storage.objects(name text primary key, bucket_id text, owner uuid references auth.users(id), owner_id text);
    insert into auth.users values ('${admin}'), ('${target}');
    insert into auth.sessions values ('${target}');
    insert into public.admin_users values ('${admin}');
    insert into public.stores values ('${target}', '{"name":"Usaha tersimpan"}');
    insert into public.partner_accounts values ('${target}', '${target}');
    insert into storage.objects values ('partners/photo.webp', 'catalog', '${target}', '${target}');
  `);
  await db.exec(await readFile(migrationUrl, 'utf8'));
  const client = {
    auth: { getUser: async (token: string) => ({ data: { user: token === session.access_token ? { id: admin } : null }, error: null }) },
    from: (table: string) => {
      if (table !== 'admin_users') throw new Error(`Unexpected table ${table}`);
      let userId: string;
      const query = { select: () => query, eq: (_column: string, id: string) => { userId = id; return query; }, maybeSingle: async () => ({ data: (await db.query('select user_id from public.admin_users where user_id=$1', [userId])).rows[0] || null, error: null }) };
      return query;
    },
    rpc: async (name: string, args: { p_user_id: string }) => {
      if (name !== 'delete_partner_auth_user') throw new Error(`Unexpected RPC ${name}`);
      rpcCalls++;
      try {
        await db.exec('set role service_role');
        const result = await db.query<{ deleted: boolean }>('select public.delete_partner_auth_user($1) as deleted', [args.p_user_id]);
        return { data: result.rows[0].deleted, error: null };
      } catch (error) {
        const failure = error as { code: string; message: string };
        return { data: null, error: { code: failure.code === '42883' ? 'PGRST202' : failure.code, message: failure.message } };
      } finally { await db.exec('reset role'); }
    },
  };
  handler = await loadFunction('create-partner-account', () => client);
}, 30_000);
afterAll(async () => { await db?.close(); });
afterEach(() => { vi.unstubAllGlobals(); });

function connect() {
  const transport = vi.fn(async (url: string, init: RequestInit) => {
    expect(url).toBe('https://supabase.example.test/functions/v1/create-partner-account');
    return handler(new Request(url, init));
  });
  vi.stubGlobal('fetch', transport);
  return transport;
}

describe('integrated partner account deletion', () => {
  it('returns the actual database refusal while the account is linked', async () => {
    connect();
    await expect(deletePartnerAccount(session, target)).rejects.toThrow('Cabut tautan');
    expect((await db.query('select * from auth.users where id=$1', [target])).rows).toHaveLength(1);
  });
  it('deletes the login and sessions after unlinking, retaining the listing and photo', async () => {
    await db.query('update public.partner_accounts set listing_id=null where user_id=$1', [target]);
    const transport = connect();
    await deletePartnerAccount(session, target);
    expect(transport).toHaveBeenCalledOnce();
    expect((await db.query('select * from auth.users where id=$1', [target])).rows).toHaveLength(0);
    expect((await db.query('select * from auth.sessions where user_id=$1', [target])).rows).toHaveLength(0);
    expect((await db.query('select * from public.partner_accounts where user_id=$1', [target])).rows).toHaveLength(0);
    expect((await db.query('select * from public.stores where id=$1', [target])).rows).toHaveLength(1);
    expect((await db.query('select name,owner,owner_id from storage.objects')).rows).toEqual([{ name: 'partners/photo.webp', owner: null, owner_id: null }]);
    await expect(deletePartnerAccount(session, target)).resolves.toBeUndefined();
  });
  it('does not call the deletion transaction when authentication fails', async () => {
    connect();const previousCalls = rpcCalls;
    await expect(deletePartnerAccount({ ...session, access_token: 'invalid' }, target)).rejects.toThrow('Sesi admin tidak valid');
    expect(rpcCalls).toBe(previousCalls);
  });
  it('shows a missing-migration error without removing the account', async () => {
    await db.query('insert into auth.users values ($1)', [target]);
    await db.query('insert into public.partner_accounts values ($1,null)', [target]);
    await db.exec('drop function public.delete_partner_auth_user(uuid)');
    connect();
    await expect(deletePartnerAccount(session, target)).rejects.toThrow('Terapkan migrasi');
    expect((await db.query('select * from auth.users where id=$1', [target])).rows).toHaveLength(1);
    await db.exec(await readFile(migrationUrl, 'utf8'));
    await expect(deletePartnerAccount(session, target)).resolves.toBeUndefined();
  });
});
