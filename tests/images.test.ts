import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MAX_SOURCE_IMAGE_BYTES, MAX_UPLOAD_IMAGE_BYTES, optimizeImage } from '../src/utils/images';

const close = vi.fn();
let encode: ReturnType<typeof vi.fn>;
beforeEach(() => {
  vi.stubGlobal('createImageBitmap', vi.fn().mockResolvedValue({width:4000,height:3000,close}));
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({drawImage:vi.fn()} as never);
  encode = vi.fn((callback: BlobCallback) => callback(new Blob(['webp'], {type:'image/webp'})));
  vi.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation(encode);
  close.mockClear();
});
const photo = () => new File(['photo'], 'photo.jpg', {type:'image/jpeg'});
describe('image preparation', () => {
  it('accepts a source over the old 15 MB cap and returns WebP', async () => {
    const file = photo(); Object.defineProperty(file, 'size', {value:20*1024*1024});
    const result = await optimizeImage(file);
    expect(result.type).toBe('image/webp'); expect(result.size).toBeLessThanOrEqual(MAX_UPLOAD_IMAGE_BYTES); expect(close).toHaveBeenCalledOnce();
  });
  it('reduces quality and then dimensions until the output fits', async () => {
    const sizes:number[] = [];
    encode.mockImplementation(function(this:HTMLCanvasElement, cb:BlobCallback) { sizes.push(this.width); cb(new Blob([new Uint8Array(sizes.length < 6 ? 1_500_001 : 100)], {type:'image/webp'})); });
    expect((await optimizeImage(photo())).size).toBe(100);
    expect(sizes).toEqual([1600,1600,1600,1600,1200,1200]);
  });
  it('refuses a browser PNG fallback instead of labelling it WebP', async () => {
    encode.mockImplementation(cb => cb(new Blob(['png'],{type:'image/png'})));
    await expect(optimizeImage(photo())).rejects.toThrow('belum mendukung'); expect(close).toHaveBeenCalledOnce();
  });
  it('handles a null encoder result and still closes decoded memory', async () => {
    encode.mockImplementation(cb => cb(null)); await expect(optimizeImage(photo())).rejects.toThrow('Konversi'); expect(close).toHaveBeenCalledOnce();
  });
  it('rejects empty, oversized, and unsupported files before decoding', async () => {
    await expect(optimizeImage(new File([], 'empty.jpg', {type:'image/jpeg'}))).rejects.toThrow('kosong');
    const big=photo();Object.defineProperty(big,'size',{value:MAX_SOURCE_IMAGE_BYTES+1});
    await expect(optimizeImage(big)).rejects.toThrow('50 MB');
    await expect(optimizeImage(new File(['x'],'photo.heic',{type:'image/heic'}))).rejects.toThrow('HEIC');
    expect(createImageBitmap).not.toHaveBeenCalled();
  });
  it('accepts a known extension if a device supplies no MIME type', async () => {
    expect((await optimizeImage(new File(['x'],'photo.png'))).type).toBe('image/webp');
  });
  it('does not enlarge a small photo', async () => {
    vi.mocked(createImageBitmap).mockResolvedValue({width:300,height:200,close} as never);
    let dimensions:number[]=[];
    encode.mockImplementation(function(this:HTMLCanvasElement,cb:BlobCallback){dimensions=[this.width,this.height];cb(new Blob(['x'],{type:'image/webp'}));});
    await optimizeImage(photo()); expect(dimensions).toEqual([300,200]);
  });
  it('frees the decoded image when dimensions are invalid', async () => {
    vi.mocked(createImageBitmap).mockResolvedValue({width:10000,height:10000,close} as never);
    await expect(optimizeImage(photo())).rejects.toThrow('64 megapiksel');expect(close).toHaveBeenCalledOnce();
  });
});
