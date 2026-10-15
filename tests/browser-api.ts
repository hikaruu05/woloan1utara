// Only loaded by tests/serve-browser.mjs. These accounts never contact Supabase.
import { optimizeImage } from '../src/utils/images';
import type { AdminListing, ListingKind, ListingStatus } from '../src/types';
import type { SupabaseSession, StoreSubmission, PartnerAccountLink } from '../src/services/supabase';
export const isSupabaseConfigured=true;
let submissions:StoreSubmission[]=[];
let listings:AdminListing[]=[];
let account={listingId:null as string|null,listingKind:'stores' as ListingKind,mustChangePassword:false};
export const readSavedSession=()=>JSON.parse(sessionStorage.getItem('woloan-test-session')||'null');
export const saveSession=(session:SupabaseSession|null)=>sessionStorage.setItem('woloan-test-session',JSON.stringify(session));
export const signIn=async(email:string,_password:string):Promise<SupabaseSession>=>({access_token:'local-test',refresh_token:'local-refresh',expires_at:Date.now()+3600000,user:{id:email.startsWith('admin')?'local-admin':'local-partner',email}});
export const signInPartner=signIn;
export const refreshSession=async(session:SupabaseSession)=>({...session,expires_at:Date.now()+3600000});
export const signOut=async()=>{};
export const isAdministrator=async(session:SupabaseSession)=>session.user.id==='local-admin';
export const getPartnerAccount=async()=>({...account});
export const fetchListings=async(kind:ListingKind,token?:string)=>listings.filter(item=>item.kind===kind&&(token||item.status==='published'));
export const fetchPartnerListing=async(_session:SupabaseSession,_kind:ListingKind,id:string)=>structuredClone(listings.find(item=>item.id===id)!);
export const fetchStoreSubmissions=async()=>structuredClone(submissions);
export const fetchPartnerAccounts=async():Promise<PartnerAccountLink[]>=>[{user_id:'local-partner',listing_kind:account.listingKind,listing_id:account.listingId,login_username:'partner'}];
export const createPartnerAccount=async()=> 'created' as const;
export const unlinkPartnerAccount=async()=>{account.listingId=null;submissions=submissions.map(item=>({...item,status:'rejected'}));};
export const changePartnerPassword=async()=>{account.mustChangePassword=false;};
export const submitStoreChanges=async(session:SupabaseSession,kind:ListingKind,id:string,payload:Record<string,unknown>)=>{
  const row:StoreSubmission={id:crypto.randomUUID(),listing_id:id,listing_kind:kind,user_id:session.user.id,payload,status:'pending',review_note:null,created_at:new Date().toISOString(),reviewed_at:null};submissions.unshift(row);return structuredClone(row);
};
export const createPartnerListingSubmission=async(session:SupabaseSession,payload:Record<string,unknown>)=>{
  const id=crypto.randomUUID();account.listingId=id;await upsertListing(account.listingKind,id,payload,'draft');await submitStoreChanges(session,account.listingKind,id,payload);return id;
};
export const reviewStoreSubmission=async(_session:SupabaseSession,id:string,decision:'approve'|'reject',note:string)=>{
  const row=submissions.find(item=>item.id===id)!;row.status=decision==='approve'?'approved':'rejected';row.review_note=note||null;if(decision==='approve')await upsertListing(row.listing_kind,row.listing_id,row.payload,'published');
};
export const upsertListing=async(kind:ListingKind,id:string|undefined,payload:Record<string,unknown>,status:ListingStatus):Promise<AdminListing>=>{
  const savedId=id||crypto.randomUUID(),now=new Date().toISOString();const row={id:savedId,kind,status,payload:{...payload,id:savedId,isVerified:status==='published'},createdAt:now,updatedAt:now} as AdminListing;listings=[row,...listings.filter(item=>item.id!==savedId)];return row;
};
export const deleteListing=async(_kind:ListingKind,id:string)=>{listings=listings.filter(item=>item.id!==id);};
export const uploadListingImage=async(file:File)=>{
  const optimized=await optimizeImage(file);const response=await fetch('/__test-uploads',{method:'POST',body:optimized,headers:{'Content-Type':'image/webp'}});return (await response.json()).url as string;
};
export const uploadPartnerListingImage=uploadListingImage;
