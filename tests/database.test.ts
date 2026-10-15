// Execute the real schema and RLS in local PostgreSQL/WASM, never in production.
// @vitest-environment node
import { PGlite } from '@electric-sql/pglite';
import { readFile } from 'node:fs/promises';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
let db:PGlite;
const admin='00000000-0000-4000-8000-000000000001';
const owner='00000000-0000-4000-8000-000000000002';
const other='00000000-0000-4000-8000-000000000003';
const payload={name:'Test shop',ownerName:'Owner',category:'kuliner',phone:'08123',address:'Woloan',products:[{id:'p',name:'Tea',price:'5000',priceNum:5000,imageUrl:''}]};
async function asUser(id:string,role='authenticated'){await db.exec(`reset role; select set_config('request.jwt.claim.sub','${id}',false); set role ${role};`);}
async function root(){await db.exec('reset role');}
beforeAll(async()=>{
  db=new PGlite();
  await db.exec(`create role anon;create role authenticated;create role service_role;
    create schema auth;create schema storage;
    create table auth.users(id uuid primary key,email text);
    create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
    grant usage on schema auth,public,storage to anon,authenticated,service_role;
    create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
    create table storage.objects(id uuid default gen_random_uuid(),bucket_id text,name text);
    alter table storage.objects enable row level security;
    grant select,insert,update,delete on storage.objects to authenticated; grant select on storage.objects to anon;
    create function storage.foldername(text) returns text[] language sql immutable as $$ select string_to_array($1,'/') $$;
  `);
  const schema=(await readFile(new URL('../supabase/schema.sql',import.meta.url),'utf8')).replace('create extension if not exists pgcrypto;','');
  await db.exec(schema);
  await db.exec(await readFile(new URL('../supabase/migrations/202610150001_partner_submission_guards.sql',import.meta.url),'utf8'));
  // Verify the schema can also be reapplied to an existing installation.
  await db.exec(schema);
  await db.query('insert into auth.users(id,email) values ($1,$2),($3,$4),($5,$6)',[admin,'admin@example.test',owner,'owner@example.test',other,'other@example.test']);
  await db.query('insert into public.admin_users(user_id,email) values ($1,$2)',[admin,'admin@example.test']);
  await db.query("insert into public.partner_accounts(user_id,listing_kind,must_change_password) values ($1,'stores',false),($2,'houses',true)",[owner,other]);
},30_000);
afterAll(async()=>db?.close());
describe('database workflow and permissions',()=>{
  let listingId:string;let submissionId:string;
  it('requires first-login password setup before submissions or uploads',async()=>{
    await asUser(other);
    await expect(db.query('select public.create_partner_listing_submission($1::jsonb)',[JSON.stringify({title:'House'})])).rejects.toThrow('kata sandi');
    await expect(db.query("insert into storage.objects(bucket_id,name) values ('catalog',$1)",[`partners/${other}/photo.webp`])).rejects.toThrow('row-level security');
  });
  it('creates the first draft and pending submission atomically',async()=>{
    await asUser(owner);
    const result=await db.query<{id:string}>('select public.create_partner_listing_submission($1::jsonb) as id',[JSON.stringify(payload)]);listingId=result.rows[0].id;
    const row=await db.query<{status:string}>('select status from public.stores where id=$1',[listingId]);expect(row.rows[0].status).toBe('draft');
    const pending=await db.query<{id:string;status:string}>('select id,status from public.partner_submissions where listing_id=$1',[listingId]);expect(pending.rows).toHaveLength(1);submissionId=pending.rows[0].id;expect(pending.rows[0].status).toBe('pending');
    await expect(db.query('select public.create_partner_listing_submission($1::jsonb)',[JSON.stringify(payload)])).rejects.toThrow('sudah memiliki');
  });
  it('keeps drafts private and prevents one partner reviewing another submission',async()=>{
    await asUser('', 'anon');expect((await db.query('select * from public.stores')).rows).toHaveLength(0);
    await asUser(other);expect((await db.query('select * from public.partner_submissions')).rows).toHaveLength(0);
    await expect(db.query('select public.approve_partner_submission($1)',[submissionId])).rejects.toThrow('Akses petugas');
  });
  it('permits only the partner’s own image path',async()=>{
    await asUser(owner);await db.query("insert into storage.objects(bucket_id,name) values ('catalog',$1)",[`partners/${owner}/photo.webp`]);
    await expect(db.query("insert into storage.objects(bucket_id,name) values ('catalog',$1)",[`partners/${other}/photo.webp`])).rejects.toThrow('row-level security');
    await expect(db.query("insert into storage.objects(bucket_id,name) values ('catalog','listings/photo.webp')")).rejects.toThrow('row-level security');
  });
  it('publishes the approved listing and leaves future edits pending separately',async()=>{
    await asUser(admin);await db.query('select public.approve_partner_submission($1)',[submissionId]);
    await asUser('','anon');expect((await db.query<{payload:typeof payload}>('select payload from public.stores')).rows[0].payload.name).toBe('Test shop');
    await asUser(owner);const pending=await db.query<{id:string}>("insert into public.partner_submissions(listing_kind,listing_id,user_id,payload) values ('stores',$1,$2,$3::jsonb) returning id",[listingId,owner,JSON.stringify({...payload,id:listingId,name:'Edited shop'})]);submissionId=pending.rows[0].id;
    await expect(db.query("insert into public.partner_submissions(listing_kind,listing_id,user_id,payload) values ('stores',$1,$2,$3::jsonb)",[listingId,owner,JSON.stringify({...payload,id:listingId})])).rejects.toThrow('duplicate key');
    await asUser('','anon');expect((await db.query<{payload:typeof payload}>('select payload from public.stores')).rows[0].payload.name).toBe('Test shop');
  });
  it('rejects invalid updates and retains rejected submissions for correction',async()=>{
    await asUser(admin);await db.query('select public.reject_partner_submission($1,$2)',[submissionId,'Please correct the address']);
    await asUser(owner);expect((await db.query<{review_note:string}>('select review_note from public.partner_submissions where id=$1',[submissionId])).rows[0].review_note).toBe('Please correct the address');
    await expect(db.query("insert into public.partner_submissions(listing_kind,listing_id,user_id,payload) values ('stores',$1,$2,$3::jsonb)",[listingId,owner,JSON.stringify({...payload,id:listingId,products:'broken'})])).rejects.toThrow('produk');
  });
  it('blocks archiving a linked listing and closes pending work on unlink',async()=>{
    await asUser(owner);const next=await db.query<{id:string}>("insert into public.partner_submissions(listing_kind,listing_id,user_id,payload) values ('stores',$1,$2,$3::jsonb) returning id",[listingId,owner,JSON.stringify({...payload,id:listingId})]);submissionId=next.rows[0].id;
    await asUser(admin);await expect(db.query("update public.stores set status='archived' where id=$1",[listingId])).rejects.toThrow('Cabut tautan');
    await db.query('update public.partner_accounts set listing_id=null where user_id=$1',[owner]);
    expect((await db.query<{status:string}>('select status from public.partner_submissions where id=$1',[submissionId])).rows[0].status).toBe('rejected');
    await expect(db.query('select public.approve_partner_submission($1)',[submissionId])).rejects.toThrow('dicabut');
    await db.query("update public.stores set status='archived' where id=$1",[listingId]);
  });
  it('rolls back an invalid first submission without leaving a linked draft',async()=>{
    await root();await db.query('update public.partner_accounts set must_change_password=false where user_id=$1',[other]);await asUser(other);
    await expect(db.query('select public.create_partner_listing_submission($1::jsonb)',[JSON.stringify({title:'House',type:'tradisional'})])).rejects.toThrow('informasi utama');
    expect((await db.query('select * from public.houses')).rows).toHaveLength(0);expect((await db.query<{listing_id:string|null}>('select listing_id from public.partner_accounts where user_id=$1',[other])).rows[0].listing_id).toBeNull();
  });
});
