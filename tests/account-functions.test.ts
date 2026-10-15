// @vitest-environment node
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';
import { describe, expect, it, vi } from 'vitest';
async function loadFunction(name:string, createClient:ReturnType<typeof vi.fn>){
  let handler!:(request:Request)=>Promise<Response>;
  const source=(await readFile(new URL(`../supabase/functions/${name}/index.ts`,import.meta.url),'utf8')).replace(/^import .*?;\n/,'');
  const code=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.None}}).outputText;
  runInNewContext(code,{createClient,Response,TextEncoder,console,Deno:{env:{get:(name:string)=>name==='SUPABASE_URL'?'https://example.test':'test-key'},serve:(callback:typeof handler)=>{handler=callback;}}});
  return handler;
}
function clients(options:{metadataError?:boolean;missingAccount?:boolean;linkError?:boolean}={}){
  const events:string[]=[];let adminChecks=0;
  const password=vi.fn(async()=>{events.push('password');return {error:null};});
  const caller={auth:{getUser:async()=>({data:{user:{id:'admin'}},error:null})}};
  const admin={auth:{admin:{updateUserById:password}},rpc:async()=>({data:'existing',error:null}),from:(table:string)=>{
    let operation='read';
    const result=()=>{
      if(table==='admin_users')return {data:adminChecks++===0?{user_id:'admin'}:null,error:null};
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
