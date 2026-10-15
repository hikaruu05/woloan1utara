// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';
import { loadFunction } from './helpers/load-edge-function';
function clients(options:{metadataError?:boolean;missingAccount?:boolean;linkError?:boolean;deleteError?:{code:string;message:string};adminAllowed?:boolean;callerId?:string}={}){
  const events:string[]=[];let adminChecks=0;
  const password=vi.fn(async()=>{events.push('password');return {error:null};});
  const caller={auth:{getUser:async()=>({data:{user:{id:options.callerId||'admin'}},error:null})}};
  const admin={auth:{admin:{updateUserById:password}},rpc:async(name:string)=>name==='delete_partner_auth_user'?{data:true,error:options.deleteError||null}:{data:'existing',error:null},from:(table:string)=>{
    let operation='read';
    const result=()=>{
      if(table==='admin_users')return {data:adminChecks++===0&&options.adminAllowed!==false?{user_id:'admin'}:null,error:null};
      if(operation==='update'){events.push('metadata');return {error:options.metadataError?{message:'DB unavailable'}:null};}
      if(operation==='insert'){events.push('link');return {error:options.linkError?{message:'DB unavailable'}:null};}
      return {data:options.missingAccount?null:{user_id:'existing',listing_kind:'stores',listing_id:'listing',login_username:'shop'},error:null};
    };
    const query={select:()=>query,eq:()=>query,update:()=>{operation='update';return query;},insert:()=>{operation='insert';return query;},maybeSingle:async()=>result(),then:(resolve:(value:unknown)=>void)=>Promise.resolve(result()).then(resolve)};
    return query;
  }};
  let calls=0;return {createClient:vi.fn(()=>calls++===0?caller:admin),events,password};
}
const request=(body:unknown)=>new Request('https://example.test/function',{method:'POST',headers:{Authorization:'Bearer test','Content-Type':'application/json'},body:JSON.stringify(body)});
const resetBody={contractVersion:4,username:'shop',listingKind:'stores',temporaryPassword:'temporary-password-123'};
describe('account provisioning failure recovery',()=>{
  it('does not change an existing password if metadata cannot be updated',async()=>{
    const mock=clients({metadataError:true});const handler=await loadFunction('create-partner-account',mock.createClient);const result=await handler(request(resetBody));expect(result.status).toBe(500);expect(mock.password).not.toHaveBeenCalled();
  });
  it('updates account metadata before returning working reset credentials',async()=>{
    const mock=clients();const handler=await loadFunction('create-partner-account',mock.createClient);const result=await handler(request(resetBody));expect(result.status).toBe(200);expect(await result.json()).toMatchObject({reset:true,contractVersion:4});expect(mock.events).toEqual(['metadata','password']);
  });
  it('does not change a password when reconnecting an account fails',async()=>{
    const mock=clients({missingAccount:true,linkError:true});const handler=await loadFunction('create-partner-account',mock.createClient);const result=await handler(request(resetBody));expect(result.status).toBe(500);expect(mock.password).not.toHaveBeenCalled();
  });
  it.each(['create-partner-account','change-partner-password'])('rejects a null request for %s without crashing',async(name)=>{
    const mock=clients();const handler=await loadFunction(name,mock.createClient);expect((await handler(request(null))).status).toBe(400);
  });
});

describe('admin account deletion endpoint',()=>{
  const userId='00000000-0000-4000-8000-000000000010';
  it('routes deletion through the protected transaction',async()=>{
    const mock=clients();const handler=await loadFunction('create-partner-account',mock.createClient);const response=await handler(request({action:'delete',contractVersion:4,userId}));expect(response.status).toBe(200);expect(await response.json()).toMatchObject({deleted:true});expect(mock.password).not.toHaveBeenCalled();
  });
  it('refuses a non-admin, invalid identifier, and self deletion',async()=>{
    const denied=await loadFunction('create-partner-account',clients({adminAllowed:false}).createClient);expect((await denied(request({action:'delete',contractVersion:4,userId}))).status).toBe(403);
    const invalid=await loadFunction('create-partner-account',clients().createClient);expect((await invalid(request({action:'delete',contractVersion:4,userId:'bad'}))).status).toBe(400);
    const self=await loadFunction('create-partner-account',clients({callerId:userId}).createClient);expect((await self(request({action:'delete',contractVersion:4,userId}))).status).toBe(403);
  });
  it('reports an unapplied migration without claiming deletion succeeded',async()=>{
    const handler=await loadFunction('create-partner-account',clients({deleteError:{code:'PGRST202',message:'not found'}}).createClient);const response=await handler(request({action:'delete',contractVersion:4,userId}));expect(response.status).toBe(503);expect((await response.json()).error).toContain('migrasi');
  });
});
