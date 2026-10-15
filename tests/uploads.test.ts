import { beforeEach, describe, expect, it, vi } from 'vitest';
import { optimizeImage } from '../src/utils/images';
import { uploadListingImage, uploadPartnerListingImage } from '../src/services/supabase';
vi.mock('../src/utils/images',()=>({optimizeImage:vi.fn()}));
const session={access_token:'test-token',refresh_token:'test-refresh',expires_at:Date.now()+3600000,user:{id:'owner'}};
const file=new File(['original'],'photo.png',{type:'image/png'});
let fetchMock:ReturnType<typeof vi.fn>;
beforeEach(()=>{fetchMock=vi.fn().mockResolvedValue({ok:true});vi.stubGlobal('fetch',fetchMock);vi.mocked(optimizeImage).mockResolvedValue(new Blob(['webp'],{type:'image/webp'}));});
describe('storage uploads',()=>{
  it.each([['admin',uploadListingImage,'/listings/'],['mitra',uploadPartnerListingImage,'/partners/owner/']] as const)('uploads only converted WebP for %s',async(_label,upload,path)=>{
    const url=await upload(file,session);const [request,options]=fetchMock.mock.calls[0];expect(request).toContain(path);expect(request).toMatch(/\.webp$/);expect(options.headers['Content-Type']).toBe('image/webp');expect(options.headers.Authorization).toBe('Bearer test-token');expect(options.body.type).toBe('image/webp');expect(url).toContain('/public/catalog/');
  });
  it('does not send the original image if conversion fails',async()=>{
    vi.mocked(optimizeImage).mockRejectedValueOnce(new Error('Bad photo'));await expect(uploadListingImage(file,session)).rejects.toThrow('Bad photo');expect(fetchMock).not.toHaveBeenCalled();
  });
  it('explains a server size mismatch after compression',async()=>{
    fetchMock.mockResolvedValueOnce({ok:false,status:413,json:async()=>({})});await expect(uploadListingImage(file,session)).rejects.toThrow('1.500.000');
  });
  it('handles network and expired authorization errors',async()=>{
    fetchMock.mockRejectedValueOnce(new TypeError('Failed to fetch'));await expect(uploadPartnerListingImage(file,session)).rejects.toThrow('Koneksi terputus');
    fetchMock.mockResolvedValueOnce({ok:false,status:403,json:async()=>({})});await expect(uploadPartnerListingImage(file,session)).rejects.toThrow('Masuk kembali');
  });
});
