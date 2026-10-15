import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AdminPage } from '../src/components/AdminPage';
import { PartnerPage } from '../src/components/PartnerPage';
const { data } = vi.hoisted(() => ({data:{} as Record<string,any>}));
vi.mock('../src/context/DataContext',()=>({useData:()=>data}));
vi.mock('../src/services/supabase',()=>({isSupabaseConfigured:true}));
vi.mock('../src/components/LocationPicker',()=>({LocationPicker:({value,onChange}:{value:string;onChange:(value:string)=>void})=><input aria-label="Map URL" value={value} onChange={e=>onChange(e.target.value)}/>}));
const payload={name:'Published shop',ownerName:'Owner',category:'kuliner',phone:'08123',address:'Woloan',products:[{id:'p',name:'Tea',price:'Rp 5.000',priceNum:5000,imageUrl:''}]};
const listing={id:'store',kind:'stores',payload,updatedAt:'2026-10-15T00:00:00Z',createdAt:'2026-01-01T00:00:00Z',status:'published'};
beforeEach(()=>{
  localStorage.clear();
  Object.keys(data).forEach(key=>delete data[key]);
  Object.assign(data,{accountId:'test-account',authLoading:false,isAdmin:false,isPartner:false,dashboardError:'',adminLoading:false,adminListings:[],partnerAccounts:[],partnerSubmissions:[],partnerListing:null,partnerListingKind:'stores',partnerMustChangePassword:false,refreshDashboard:vi.fn(),showToast:vi.fn(),logoutAdmin:vi.fn(),loginAdmin:vi.fn(),loginPartner:vi.fn(),saveListing:vi.fn().mockResolvedValue('saved'),submitPartnerListing:vi.fn().mockResolvedValue(undefined),uploadImage:vi.fn(),uploadPartnerImage:vi.fn()});
});
describe('admin editor',()=>{
  it('resets status and products when switching catalogs',async()=>{
    data.isAdmin=true;data.adminListings=[listing];const user=userEvent.setup();render(<AdminPage/>);
    await user.click(screen.getByRole('button',{name:'Toko & UMKM 1 listing'}));
    await user.click(screen.getByRole('button',{name:'Ubah',exact:true}));
    expect((screen.getByRole('combobox',{name:'Status publikasi'}) as HTMLSelectElement).value).toBe('published');
    expect(screen.getByDisplayValue('Tea')).toBeTruthy();
    await user.click(screen.getByRole('button',{name:'Destinasi Wisata 0 listing'}));
    await user.click(screen.getByRole('button',{name:'Toko & UMKM 1 listing'}));
    expect((screen.getByRole('combobox',{name:'Status publikasi'}) as HTMLSelectElement).value).toBe('draft');
    expect(screen.queryByDisplayValue('Tea')).toBeNull();
  });
  it('preserves hidden fields when editing a house',async()=>{
    data.isAdmin=true;data.adminListings=[{...listing,id:'house',kind:'houses',payload:{title:'House',type:'tradisional',floors:1,isCustomAllowed:true,createdAt:'2025-01-01',woodTypes:['Wasian'],features:[]},status:'draft'}];
    const user=userEvent.setup();render(<AdminPage/>);await user.click(screen.getByRole('button',{name:'Ubah',exact:true}));await user.click(screen.getByRole('button',{name:'Simpan perubahan'}));
    expect(data.saveListing).toHaveBeenCalledWith('houses','house',expect.objectContaining({isCustomAllowed:true,createdAt:'2025-01-01',woodTypes:['Wasian']}),'draft');
  });
  it('locks saving and catalog changes until an upload completes',async()=>{
    data.isAdmin=true;let finish!:(value:string)=>void;data.uploadImage.mockReturnValue(new Promise(resolve=>{finish=resolve;}));
    const user=userEvent.setup();const {container}=render(<AdminPage/>);
    const fileInput=container.querySelector('input[type="file"]')!;
    await user.upload(fileInput as HTMLInputElement,new File(['photo'],'photo.jpg',{type:'image/jpeg'}));
    expect((screen.getByRole('button',{name:/Mengoptimalkan dan mengunggah foto utama/}) as HTMLButtonElement).disabled).toBe(true);
    expect(screen.getByRole('button',{name:'Toko & UMKM 0 listing'}).closest('fieldset')?.disabled).toBe(true);
    await act(async()=>finish('https://example.com/photo.webp'));
    expect(screen.getByAltText('Pratinjau foto listing').getAttribute('src')).toBe('https://example.com/photo.webp');
    expect((fileInput as HTMLInputElement).value).toBe('');
  });
  it('exposes all submitted products and fields for review',async()=>{
    data.isAdmin=true;data.partnerSubmissions=[{id:'s',status:'pending',listing_kind:'stores',payload,created_at:'2026-10-15T01:00:00Z'}];
    const user=userEvent.setup();render(<AdminPage/>);await user.click(screen.getByText('Periksa seluruh data, produk, dan foto pengajuan'));expect(screen.getByRole('heading',{name:'Produk yang diajukan (1)'})).toBeTruthy();expect(screen.getByText('Tea')).toBeTruthy();
  });
});
describe('mitra flow',()=>{
  it('shows the latest rejected values so the owner can correct and resubmit',async()=>{
    data.isPartner=true;data.partnerListing=listing;data.partnerSubmissions=[{id:'s',listing_id:'store',listing_kind:'stores',created_at:'2026-10-15T01:00:00Z',status:'rejected',review_note:'Fix address',payload:{...payload,name:'Updated shop'}}];
    const user=userEvent.setup();render(<PartnerPage/>);expect(screen.getByDisplayValue('Updated shop')).toBeTruthy();expect(screen.getByText('Catatan petugas: Fix address')).toBeTruthy();await user.click(screen.getByRole('button',{name:'Kirim perubahan untuk diperiksa'}));
    expect(data.submitPartnerListing).toHaveBeenCalledWith(expect.objectContaining({name:'Updated shop',products:[expect.objectContaining({name:'Tea'})]}));
  });
  it('locks editing and uploads while a submission is pending',()=>{
    data.isPartner=true;data.partnerListing=listing;data.partnerSubmissions=[{id:'s',listing_id:'store',listing_kind:'stores',created_at:'2026-10-15T01:00:00Z',status:'pending',payload}];
    const {container}=render(<PartnerPage/>);expect((screen.getByDisplayValue('Published shop') as HTMLInputElement).disabled).toBe(false); // inherited fieldset state
    expect(screen.getByDisplayValue('Published shop').closest('fieldset')?.disabled).toBe(true);
    expect((container.querySelector('input[type="file"]') as HTMLInputElement).closest('fieldset')?.disabled).toBe(true);
    expect((screen.getByRole('button',{name:'Menunggu pemeriksaan'}) as HTMLButtonElement).disabled).toBe(true);
  });
  it('retains successful gallery uploads when another photo fails',async()=>{
    data.isPartner=true;data.partnerListingKind='houses';data.uploadPartnerImage.mockResolvedValueOnce('https://example.com/first.webp').mockRejectedValueOnce(new Error('Bad photo'));
    const user=userEvent.setup();const {container}=render(<PartnerPage/>);const gallery=container.querySelector('input[multiple]') as HTMLInputElement;
    await user.upload(gallery,[new File(['a'],'a.jpg',{type:'image/jpeg'}),new File(['b'],'b.jpg',{type:'image/jpeg'})]);
    await waitFor(()=>expect(screen.getByRole('alert').textContent).toContain('Bad photo'));
    expect(screen.getByAltText('Foto galeri 1').getAttribute('src')).toBe('https://example.com/first.webp');
  });
  it('shows the correct portal when an authenticated user opens the other login',()=>{
    data.isAdmin=true;render(<PartnerPage/>);expect(screen.getByRole('link',{name:'Buka Dashboard Admin'}).getAttribute('href')).toBe('#/admin');expect(screen.queryByRole('textbox',{name:'Username'})).toBeNull();
  });
});

describe('draft restoration in real editor components',()=>{
  it('restores a mitra’s first listing, products, and uploaded photo after remount',async()=>{
    data.isPartner=true;data.uploadPartnerImage.mockResolvedValue('https://example.com/draft.webp');const user=userEvent.setup();
    const first=render(<PartnerPage/>);await user.type(screen.getByRole('textbox',{name:/^Nama usaha\s*\*$/}),'Unsent shop');await user.click(screen.getByRole('button',{name:'Tambah produk',exact:true}));await user.type(screen.getByRole('textbox',{name:'Nama produk',exact:true}),'Draft product');
    await user.upload(first.container.querySelector('input[type="file"]') as HTMLInputElement,new File(['photo'],'photo.jpg',{type:'image/jpeg'}));await waitFor(()=>expect(screen.getByAltText('Pratinjau foto listing')).toBeTruthy());
    first.unmount();render(<PartnerPage/>);expect(screen.getByDisplayValue('Unsent shop')).toBeTruthy();expect(screen.getByDisplayValue('Draft product')).toBeTruthy();expect(screen.getByAltText('Pratinjau foto listing').getAttribute('src')).toBe('https://example.com/draft.webp');expect(screen.getByText(/Draf dipulihkan/)).toBeTruthy();expect(data.submitPartnerListing).not.toHaveBeenCalled();
  });
  it('restores the admin’s active listing and edits without affecting another listing',async()=>{
    data.isAdmin=true;data.adminListings=[listing,{...listing,id:'second',payload:{...payload,name:'Second shop'}}];const user=userEvent.setup();let first=render(<AdminPage/>);
    await user.click(screen.getByRole('button',{name:'Toko & UMKM 2 listing'}));await user.click(screen.getAllByRole('button',{name:'Ubah',exact:true})[0]);
    const name=screen.getByRole('textbox',{name:/^Nama toko\/usaha\s*\*$/});await user.clear(name);await user.type(name,'Admin unsaved edit');first.unmount();first=render(<AdminPage/>);
    expect(screen.getByDisplayValue('Admin unsaved edit')).toBeTruthy();expect(screen.getByRole('button',{name:'Simpan perubahan'})).toBeTruthy();
    await user.click(screen.getAllByRole('button',{name:'Ubah',exact:true})[1]);expect(screen.getByDisplayValue('Second shop')).toBeTruthy();
    await user.click(screen.getAllByRole('button',{name:'Ubah',exact:true})[0]);expect(screen.getByDisplayValue('Admin unsaved edit')).toBeTruthy();
  });
  it('keeps a mitra draft after a failed send and clears it only on success',async()=>{
    data.isPartner=true;data.partnerListing=listing;data.submitPartnerListing.mockRejectedValueOnce(new Error('Offline'));const user=userEvent.setup();let first=render(<PartnerPage/>);
    const name=screen.getByRole('textbox',{name:/^Nama usaha\s*\*$/});await user.clear(name);await user.type(name,'Edited before sending');await user.click(screen.getByRole('button',{name:'Kirim perubahan untuk diperiksa'}));expect(screen.getByRole('alert').textContent).toBe('Offline');first.unmount();first=render(<PartnerPage/>);expect(screen.getByDisplayValue('Edited before sending')).toBeTruthy();
    await user.click(screen.getByRole('button',{name:'Kirim perubahan untuk diperiksa'}));first.unmount();render(<PartnerPage/>);expect(screen.queryByDisplayValue('Edited before sending')).toBeNull();expect(screen.getByDisplayValue('Published shop')).toBeTruthy();
  });
  it('lets an owner discard a local draft and restores the published baseline',async()=>{
    data.isPartner=true;data.partnerListing=listing;const user=userEvent.setup();const first=render(<PartnerPage/>);const name=screen.getByRole('textbox',{name:/^Nama usaha\s*\*$/});await user.type(name,' edited');await user.click(screen.getByRole('button',{name:'Hapus draf di browser',exact:true}));expect(screen.getByDisplayValue('Published shop')).toBeTruthy();first.unmount();render(<PartnerPage/>);expect(screen.queryByText(/Draf dipulihkan/)).toBeNull();
  });
});

it('does not let an old local draft replace a pending approval',async()=>{
  data.isPartner=true;data.partnerListing=listing;const user=userEvent.setup();const first=render(<PartnerPage/>);
  await user.type(screen.getByRole('textbox',{name:/^Nama usaha\s*\*$/}),' unsent draft');
  data.partnerSubmissions=[{id:'pending',listing_id:'store',listing_kind:'stores',created_at:'2026-10-15T01:00:00Z',status:'pending',payload:{...payload,name:'Submitted version'}}];
  first.rerender(<PartnerPage/>);expect(screen.getByDisplayValue('Submitted version')).toBeTruthy();expect(screen.queryByDisplayValue('Published shop unsent draft')).toBeNull();expect(screen.queryByRole('button',{name:'Pulihkan draf lama'})).toBeNull();
});
