import { describe, expect, it } from 'vitest';
import { normalizeListing, partnerDraft, validateListing } from '../src/utils/listings';
import type { AdminListing } from '../src/types';
import type { StoreSubmission } from '../src/services/supabase';
const listing = {id:'one',kind:'stores',updatedAt:'2026-10-15T00:00:00Z',payload:{name:'Published',products:[]}} as AdminListing;
const submission = {id:'s',listing_id:'one',listing_kind:'stores',status:'rejected',created_at:'2026-10-15T01:00:00+00:00',payload:{name:'Edited',products:[]}} as StoreSubmission;
describe('listing and resubmission flow', () => {
  it('restores rejected and pending edits instead of the published payload', () => {
    expect(partnerDraft(listing,[submission]).name).toBe('Edited');
    expect(partnerDraft(listing,[{...submission,status:'pending'}]).name).toBe('Edited');
  });
  it('uses newer admin content and ignores submissions for another listing', () => {
    expect(partnerDraft({...listing,updatedAt:'2026-10-15T02:00:00Z'},[submission]).name).toBe('Published');
    expect(partnerDraft(listing,[{...submission,listing_id:'other'}]).name).toBe('Published');
    expect(partnerDraft(listing,[{...submission,status:'approved'}]).name).toBe('Published');
  });
  it('keeps metadata and normalizes arrays and numbers without clearing flags', () => {
    const result=normalizeListing('houses',{title:' House ',woodTypes:['Wasian'],features:'porch, balcony',isCustomAllowed:true,createdAt:'2025-01-01',floors:'2'});
    expect(result).toMatchObject({title:'House',woodTypes:['Wasian'],features:['porch','balcony'],isCustomAllowed:true,createdAt:'2025-01-01',floors:2});
  });
  it('allows an incomplete named draft but blocks incomplete publication', () => {
    expect(()=>validateListing('stores',{name:'Shop'},false)).not.toThrow();
    expect(()=>validateListing('stores',{name:'Shop'},true)).toThrow('wajib');
  });
  it('rejects unnamed products and invalid numbers instead of silently dropping data', () => {
    expect(()=>normalizeListing('stores',{products:[{name:' '}]})).toThrow('nama');
    expect(()=>normalizeListing('houses',{floors:'-1'})).toThrow('angka');
  });
  it('rejects executable links and preserves optional fields', () => {
    expect(()=>validateListing('houses',{title:'House',mapsUrl:'javascript:alert(1)'},false)).toThrow('https');
    expect(normalizeListing('stores',{badge:'Featured',products:[{name:' Tea ',price:''}]})).toMatchObject({badge:'Featured',products:[{name:'Tea',price:'Hubungi penjual'}]});
  });
});
