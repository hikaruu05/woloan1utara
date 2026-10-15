import { afterEach, describe, expect, it, vi } from 'vitest';
import { deletePartnerAccount, refreshSession } from '../src/services/supabase';
const session={access_token:'admin-token',refresh_token:'refresh',expires_at:Date.now()+3600000,user:{id:'admin'}};
afterEach(()=>{vi.useRealTimers();vi.unstubAllGlobals();});
describe('partner account deletion request',()=>{
  it('sends a target ID to the protected account function',async()=>{
    const fetchMock=vi.fn().mockResolvedValue({ok:true,json:async()=>({contractVersion:4,deleted:true})});vi.stubGlobal('fetch',fetchMock);await deletePartnerAccount(session,'target');const [url,options]=fetchMock.mock.calls[0];expect(url).toContain('/functions/v1/create-partner-account');expect(JSON.parse(options.body)).toEqual({action:'delete',contractVersion:4,userId:'target'});expect(options.headers.Authorization).toBe('Bearer admin-token');
  });
  it('does not accept an old function response as successful deletion',async()=>{
    vi.stubGlobal('fetch',vi.fn().mockResolvedValue({ok:true,json:async()=>({contractVersion:4,ok:true})}));await expect(deletePartnerAccount(session,'target')).rejects.toThrow('Deploy ulang');
  });
  it('reports server and network errors without claiming success',async()=>{
    const fetchMock=vi.fn().mockResolvedValueOnce({ok:false,json:async()=>({error:'Cabut tautan dulu'})}).mockRejectedValueOnce(new TypeError('Offline'));vi.stubGlobal('fetch',fetchMock);await expect(deletePartnerAccount(session,'target')).rejects.toThrow('Cabut tautan dulu');await expect(deletePartnerAccount(session,'target')).rejects.toThrow('Muat ulang daftar');
  });
  it.each([
    [401,{message:'Invalid JWT'},'Silakan keluar lalu masuk kembali'],
    [404,{message:'Function not found'},'deploy ulang'],
    [400,{error:'Pilih jenis katalog yang valid.'},'deploy ulang'],
    [409,{error:'Versi formulir akun tidak sesuai. Muat ulang situs lalu coba lagi.'},'deploy ulang'],
    [500,{message:'Database unavailable'},'Database unavailable'],
    [503,{error:'Terapkan migrasi penghapusan akun mitra'},'Terapkan migrasi'],
  ])('explains a failed request (%s) instead of silently losing the reason',async(status,body,message)=>{
    vi.stubGlobal('fetch',vi.fn().mockResolvedValue({ok:false,status,json:async()=>body}));await expect(deletePartnerAccount(session,'target')).rejects.toThrow(message);
  });
  it('stops waiting after 30 seconds and asks the admin to check the account status',async()=>{
    vi.useFakeTimers();vi.stubGlobal('fetch',vi.fn((_url,options)=>new Promise((_resolve,reject)=>{options.signal.addEventListener('abort',()=>reject(new DOMException('Aborted','AbortError')));})));const result=expect(deletePartnerAccount(session,'target')).rejects.toThrow('setelah 30 detik');await vi.advanceTimersByTimeAsync(30_000);await result;expect(vi.getTimerCount()).toBe(0);
  });
  it('also bounds the wait when the server returns headers but stalls on the response body',async()=>{
    vi.useFakeTimers();vi.stubGlobal('fetch',vi.fn(async(_url,options)=>({ok:true,json:()=>new Promise((_resolve,reject)=>options.signal.addEventListener('abort',()=>reject(new DOMException('Aborted','AbortError'))))})));const result=expect(deletePartnerAccount(session,'target')).rejects.toThrow('setelah 30 detik');await vi.advanceTimersByTimeAsync(30_000);await result;
  });
  it('bounds an expired-session refresh before deletion can begin',async()=>{
    vi.useFakeTimers();vi.stubGlobal('fetch',vi.fn((_url,options)=>new Promise((_resolve,reject)=>options.signal.addEventListener('abort',()=>reject(new DOMException('Aborted','AbortError'))))));const result=expect(refreshSession(session)).rejects.toThrow('Sesi belum dapat diperbarui setelah 30 detik');await vi.advanceTimersByTimeAsync(30_000);await result;expect(vi.getTimerCount()).toBe(0);
  });
  it('preserves the authentication status so an invalid refresh still signs the admin out',async()=>{
    vi.stubGlobal('fetch',vi.fn(async()=>({ok:false,status:401,json:async()=>({message:'Invalid refresh token'})})));await expect(refreshSession(session)).rejects.toMatchObject({status:401,message:'Invalid refresh token'});
  });
});
