import React, { StrictMode } from 'react';
import { act, render, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DataProvider, useData } from '../src/context/DataContext';
import * as api from '../src/services/supabase';
vi.mock('../src/services/supabase',()=>({
  isSupabaseConfigured:true, readSavedSession:vi.fn(),saveSession:vi.fn(),fetchListings:vi.fn(),isAdministrator:vi.fn(),getPartnerAccount:vi.fn(),fetchPartnerListing:vi.fn(),fetchStoreSubmissions:vi.fn(),fetchPartnerAccounts:vi.fn(),refreshSession:vi.fn(),signIn:vi.fn(),signInPartner:vi.fn(),signOut:vi.fn(),submitStoreChanges:vi.fn(),createPartnerListingSubmission:vi.fn(),reviewStoreSubmission:vi.fn(),uploadPartnerListingImage:vi.fn(),createPartnerAccount:vi.fn(),unlinkPartnerAccount:vi.fn(),changePartnerPassword:vi.fn(),upsertListing:vi.fn(),uploadListingImage:vi.fn(),deleteListing:vi.fn()
}));
let data:ReturnType<typeof useData>;
function Probe(){const value=useData();React.useEffect(()=>{data=value;});return null;}
const session=()=>({access_token:'access',refresh_token:'refresh',expires_at:Date.now()+3_600_000,user:{id:'user',email:'admin@example.test'}});
beforeEach(()=>{
  vi.resetAllMocks();vi.mocked(api.readSavedSession).mockReturnValue(null);vi.mocked(api.fetchListings).mockResolvedValue([]);vi.mocked(api.fetchStoreSubmissions).mockResolvedValue([]);vi.mocked(api.fetchPartnerAccounts).mockResolvedValue([]);vi.mocked(api.isAdministrator).mockResolvedValue(false);vi.mocked(api.getPartnerAccount).mockResolvedValue({listingId:null,listingKind:'stores',mustChangePassword:false});vi.mocked(api.signIn).mockImplementation(async()=>session());vi.mocked(api.signInPartner).mockImplementation(async()=>session());vi.mocked(api.uploadPartnerListingImage).mockResolvedValue('https://example.test/photo.webp');
});
async function mount(){render(<DataProvider><Probe/></DataProvider>);await waitFor(()=>expect(data.authLoading).toBe(false));}
async function loginAdmin(){vi.mocked(api.isAdministrator).mockResolvedValue(true);await act(async()=>data.loginAdmin('admin@example.test','password'));}
describe('session and mutation recovery',()=>{
  it('restores an expired session once in Strict Mode',async()=>{
    vi.mocked(api.readSavedSession).mockReturnValue({...session(),expires_at:1});vi.mocked(api.refreshSession).mockResolvedValue(session());
    render(<StrictMode><DataProvider><Probe/></DataProvider></StrictMode>);await waitFor(()=>expect(data.authLoading).toBe(false));expect(api.refreshSession).toHaveBeenCalledOnce();expect(data.isPartner).toBe(true);
  });
  it('keeps successful admin login when a dashboard fetch fails',async()=>{
    await mount();vi.mocked(api.fetchPartnerAccounts).mockRejectedValueOnce(new Error('Network down'));await loginAdmin();expect(data.isAdmin).toBe(true);expect(data.dashboardError).toBe('Network down');
  });
  it('returns new credentials even when refreshing the account list fails',async()=>{
    await mount();await loginAdmin();vi.mocked(api.createPartnerAccount).mockResolvedValue('created');vi.mocked(api.fetchPartnerAccounts).mockRejectedValueOnce(new Error('Network down'));
    let result:string='';await act(async()=>{result=await data.createPartnerAccount('shop','stores','temporary-password');});expect(result).toBe('created');expect(data.dashboardError).toContain('kredensial');
  });
  it('shares token refresh between simultaneous uploads',async()=>{
    const expiring={...session(),expires_at:Date.now()+90_000};vi.mocked(api.signInPartner).mockResolvedValue(expiring);await mount();await act(async()=>data.loginPartner('shop','password'));
    const now=Date.now();vi.spyOn(Date,'now').mockReturnValue(now+40_000);let finish!:(s:ReturnType<typeof session>)=>void;
    vi.mocked(api.refreshSession).mockReturnValue(new Promise(resolve=>finish=resolve));
    const file=new File(['x'],'p.jpg',{type:'image/jpeg'});let uploads:Promise<string[]>;
    await act(async()=>{uploads=Promise.all([data.uploadPartnerImage(file),data.uploadPartnerImage(file)]);});expect(api.refreshSession).toHaveBeenCalledOnce();
    await act(async()=>{finish({...session(),access_token:'new'});await uploads;});expect(api.uploadPartnerListingImage).toHaveBeenCalledTimes(2);expect(api.uploadPartnerListingImage).toHaveBeenCalledWith(file,expect.objectContaining({access_token:'new'}));
  });
  it('clears all private data immediately on logout',async()=>{
    await mount();await loginAdmin();let finish!:()=>void;vi.mocked(api.signOut).mockReturnValue(new Promise(resolve=>finish=resolve));let logout:Promise<void>;
    await act(async()=>{logout=data.logoutAdmin();});expect(data.isAdmin).toBe(false);expect(data.accountId).toBeNull();expect(data.partnerAccounts).toEqual([]);await act(async()=>{finish();await logout;});
  });
  it('rereads the partner account so an unlinked owner can make a new listing',async()=>{
    vi.mocked(api.getPartnerAccount).mockResolvedValue({listingId:'old',listingKind:'stores',mustChangePassword:false});vi.mocked(api.fetchPartnerListing).mockResolvedValue({id:'old',kind:'stores',payload:{} } as never);
    await mount();await act(async()=>data.loginPartner('shop','password'));expect(data.partnerListing?.id).toBe('old');vi.mocked(api.getPartnerAccount).mockResolvedValue({listingId:null,listingKind:'houses',mustChangePassword:false});
    await act(async()=>data.refreshPartnerData());expect(data.partnerListing).toBeNull();expect(data.partnerListingKind).toBe('houses');
  });
  it('keeps a successful submission pending when the follow-up refresh fails',async()=>{
    vi.mocked(api.getPartnerAccount).mockResolvedValue({listingId:'store',listingKind:'stores',mustChangePassword:false});vi.mocked(api.fetchPartnerListing).mockResolvedValue({id:'store',kind:'stores',payload:{}} as never);
    await mount();await act(async()=>data.loginPartner('shop','password'));
    vi.mocked(api.submitStoreChanges).mockResolvedValue({id:'submission',listing_id:'store',listing_kind:'stores',status:'pending'} as never);vi.mocked(api.getPartnerAccount).mockRejectedValueOnce(new Error('Network down'));
    const payload={name:'Shop',ownerName:'Owner',category:'kuliner',phone:'08123',address:'Woloan',products:[{id:'p',name:'Tea',price:'5000'}]};
    await act(async()=>data.submitPartnerListing(payload));expect(data.partnerSubmissions[0].status).toBe('pending');
    await expect(data.submitPartnerListing(payload)).rejects.toThrow('sedang diperiksa');expect(api.submitStoreChanges).toHaveBeenCalledOnce();
  });
});
