import React from 'react';
import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PartnerAccountsPanel } from '../src/components/PartnerAccountsPanel';
import type { PartnerAccountLink } from '../src/services/supabase';
import type { AdminListing } from '../src/types';
const accounts:PartnerAccountLink[]=Array.from({length:23},(_,index)=>({user_id:`user-${index+1}`,listing_kind:'stores',listing_id:index%2===0?`listing-${index+1}`:null,login_username:`mitra_${String(index+1).padStart(2,'0')}`}));
const listings=accounts.filter(account=>account.listing_id).map(account=>({id:account.listing_id,kind:'stores',payload:{name:`Usaha ${account.login_username}`,ownerName:`Pemilik ${account.login_username}`}})) as AdminListing[];
const row=(name:string)=>screen.getByText(name,{exact:true}).closest('li')!;
describe('partner account management',()=>{
  it('shows 10 accounts per page and handles the last page',async()=>{
    const user=userEvent.setup();render(<PartnerAccountsPanel accounts={accounts} listings={listings} onUnlink={vi.fn()} onDelete={vi.fn()}/>);
    expect(screen.getAllByRole('listitem')).toHaveLength(10);expect(screen.getByText('Menampilkan 1–10 dari 23 akun mitra')).toBeTruthy();
    expect((screen.getByRole('button',{name:'Halaman akun mitra sebelumnya'}) as HTMLButtonElement).disabled).toBe(true);
    await user.click(screen.getByRole('button',{name:'Halaman akun mitra berikutnya'}));expect(screen.getByText('mitra_11',{exact:true})).toBeTruthy();expect(screen.queryByText('mitra_01',{exact:true})).toBeNull();
    await user.click(screen.getByRole('button',{name:'Halaman akun mitra berikutnya'}));expect(screen.getAllByRole('listitem')).toHaveLength(3);expect(screen.getByText('Menampilkan 21–23 dari 23 akun mitra')).toBeTruthy();expect((screen.getByRole('button',{name:'Halaman akun mitra berikutnya'}) as HTMLButtonElement).disabled).toBe(true);
  });
  it('searches all pages and resets the page for a new query',async()=>{
    const user=userEvent.setup();render(<PartnerAccountsPanel accounts={accounts} listings={listings} onUnlink={vi.fn()} onDelete={vi.fn()}/>);
    await user.click(screen.getByRole('button',{name:'Halaman akun mitra berikutnya'}));await user.type(screen.getByRole('searchbox',{name:'Cari akun mitra'}),' MITRA_23 ');
    expect(screen.getAllByRole('listitem')).toHaveLength(1);expect(screen.getByText('mitra_23',{exact:true})).toBeTruthy();expect(screen.getByText('Menampilkan 1–1 dari 1 akun mitra · Total 23 akun')).toBeTruthy();
    await user.clear(screen.getByRole('searchbox',{name:'Cari akun mitra'}));expect(screen.getByText('mitra_01',{exact:true})).toBeTruthy();
  });
  it('searches listing names and owner names',async()=>{
    const user=userEvent.setup();render(<PartnerAccountsPanel accounts={accounts} listings={listings} onUnlink={vi.fn()} onDelete={vi.fn()}/>);
    const search=screen.getByRole('searchbox',{name:'Cari akun mitra'});await user.type(search,'PEMILIK mitra_21');expect(screen.getByText('mitra_21',{exact:true})).toBeTruthy();
    await user.clear(search);await user.type(search,'Usaha mitra_23');expect(screen.getByText('mitra_23',{exact:true})).toBeTruthy();expect(screen.getAllByRole('listitem')).toHaveLength(1);
  });
  it('filters linked and unlinked accounts without deleting either group',async()=>{
    const user=userEvent.setup();render(<PartnerAccountsPanel accounts={accounts} listings={listings} onUnlink={vi.fn()} onDelete={vi.fn()}/>);
    await user.selectOptions(screen.getByRole('combobox',{name:'Status tautan'}),'unlinked');expect(screen.getByText('Menampilkan 1–10 dari 11 akun mitra · Total 23 akun')).toBeTruthy();expect(within(row('mitra_02')).getByText('Tanpa tautan listing')).toBeTruthy();expect(screen.queryByRole('button',{name:/Cabut tautan listing mitra/})).toBeNull();
    await user.selectOptions(screen.getByRole('combobox',{name:'Status tautan'}),'linked');expect(screen.getByText('Menampilkan 1–10 dari 12 akun mitra · Total 23 akun')).toBeTruthy();expect(screen.queryByText('mitra_02',{exact:true})).toBeNull();
  });
  it('keeps the account visible after its listing is unlinked',async()=>{
    vi.spyOn(window,'confirm').mockReturnValue(true);const unlink=vi.fn().mockResolvedValue(undefined);const user=userEvent.setup();const first=render(<PartnerAccountsPanel accounts={[accounts[0]]} listings={listings} onUnlink={unlink} onDelete={vi.fn()}/>);
    await user.click(screen.getByRole('button',{name:'Cabut tautan listing mitra_01'}));expect(unlink).toHaveBeenCalledWith('stores','listing-1');expect(window.confirm).toHaveBeenCalledWith(expect.stringContaining('Akun mitra dan listing tetap tersimpan'));
    first.rerender(<PartnerAccountsPanel accounts={[{...accounts[0],listing_id:null}]} listings={listings} onUnlink={unlink} onDelete={vi.fn()}/>);
    expect(screen.getByText('mitra_01',{exact:true})).toBeTruthy();expect(screen.getByText('Tanpa tautan listing',{selector:'span'})).toBeTruthy();expect(screen.queryByRole('button',{name:'Cabut tautan listing mitra_01'})).toBeNull();expect(screen.getByText(/Tautan akun mitra_01 telah dicabut/)).toBeTruthy();
  });
  it('cancels unlinking and reports failures without losing the account',async()=>{
    const confirm=vi.spyOn(window,'confirm').mockReturnValue(false);const unlink=vi.fn().mockRejectedValue(new Error('Koneksi terputus'));const user=userEvent.setup();render(<PartnerAccountsPanel accounts={[accounts[0]]} listings={listings} onUnlink={unlink} onDelete={vi.fn()}/>);
    await user.click(screen.getByRole('button',{name:'Cabut tautan listing mitra_01'}));expect(unlink).not.toHaveBeenCalled();confirm.mockReturnValue(true);
    await user.click(screen.getByRole('button',{name:'Cabut tautan listing mitra_01'}));expect(screen.getByRole('alert').textContent).toBe('Koneksi terputus');expect(screen.getByText('mitra_01',{exact:true})).toBeTruthy();
  });
  it('clamps the page when account data shrinks',async()=>{
    const user=userEvent.setup();const first=render(<PartnerAccountsPanel accounts={accounts} listings={listings} onUnlink={vi.fn()} onDelete={vi.fn()}/>);
    await user.click(screen.getByRole('button',{name:'Halaman akun mitra berikutnya'}));await user.click(screen.getByRole('button',{name:'Halaman akun mitra berikutnya'}));
    first.rerender(<PartnerAccountsPanel accounts={accounts.slice(0,11)} listings={listings} onUnlink={vi.fn()} onDelete={vi.fn()}/>);expect(screen.getByText('mitra_11',{exact:true})).toBeTruthy();expect(screen.getByText('Menampilkan 11–11 dari 11 akun mitra')).toBeTruthy();
  });
  it('lets the user reset an empty search',async()=>{
    const user=userEvent.setup();render(<PartnerAccountsPanel accounts={accounts} listings={listings} onUnlink={vi.fn()} onDelete={vi.fn()}/>);await user.type(screen.getByRole('searchbox',{name:'Cari akun mitra'}),'nothing matches');expect(screen.getByText('Tidak ada akun yang cocok dengan pencarian dan status tautan.')).toBeTruthy();await user.click(screen.getByRole('button',{name:'Reset pencarian dan filter'}));expect(screen.getAllByRole('listitem')).toHaveLength(10);
  });
  it('disables repeated unlinking until the request finishes',async()=>{
    vi.spyOn(window,'confirm').mockReturnValue(true);let finish!:()=>void;const unlink=vi.fn(()=>new Promise<void>(resolve=>{finish=resolve;}));const user=userEvent.setup();render(<PartnerAccountsPanel accounts={[accounts[0]]} listings={listings} onUnlink={unlink} onDelete={vi.fn()}/>);
    await user.click(screen.getByRole('button',{name:'Cabut tautan listing mitra_01'}));expect(screen.getByRole('searchbox',{name:'Cari akun mitra'}).closest('fieldset')?.disabled).toBe(true);await act(async()=>finish());expect(unlink).toHaveBeenCalledOnce();
  });
});

describe('permanent partner account deletion',()=>{
  it('requires unlinking before the delete button becomes available',async()=>{
    const onDelete=vi.fn();const user=userEvent.setup();const first=render(<PartnerAccountsPanel accounts={[accounts[0]]} listings={listings} onUnlink={vi.fn()} onDelete={onDelete}/>);
    const button=screen.getByRole('button',{name:'Hapus akun mitra mitra_01'});expect((button as HTMLButtonElement).disabled).toBe(true);await user.click(button);expect(onDelete).not.toHaveBeenCalled();
    first.rerender(<PartnerAccountsPanel accounts={[{...accounts[0],listing_id:null}]} listings={listings} onUnlink={vi.fn()} onDelete={onDelete}/>);expect((screen.getByRole('button',{name:'Hapus akun mitra mitra_01'}) as HTMLButtonElement).disabled).toBe(false);
  });
  it('deletes the selected account only after confirmation',async()=>{
    const onDelete=vi.fn().mockResolvedValue(undefined);const user=userEvent.setup();const first=render(<PartnerAccountsPanel accounts={[accounts[1]]} listings={listings} onUnlink={vi.fn()} onDelete={onDelete}/>);
    await user.click(screen.getByRole('button',{name:'Hapus akun mitra mitra_02'}));expect(onDelete).not.toHaveBeenCalled();expect(screen.getByRole('dialog').textContent).toContain('Penghapusan akun tidak dapat dibatalkan');
    await user.click(screen.getByRole('button',{name:'Batal'}));expect(screen.queryByRole('dialog')).toBeNull();expect(onDelete).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button',{name:'Hapus akun mitra mitra_02'}));await user.click(screen.getByRole('button',{name:'Ya, hapus akun'}));expect(onDelete).toHaveBeenCalledWith('user-2');expect(screen.queryByRole('dialog')).toBeNull();
    first.rerender(<PartnerAccountsPanel accounts={[]} listings={listings} onUnlink={vi.fn()} onDelete={onDelete}/>);expect(screen.queryByText('mitra_02',{exact:true})).toBeNull();expect(screen.getByText('Belum ada akun mitra.')).toBeTruthy();expect(screen.getByText(/Akun mitra mitra_02 telah dihapus/)).toBeTruthy();
  });
  it('keeps the account visible if the server refuses deletion',async()=>{
    const user=userEvent.setup();render(<PartnerAccountsPanel accounts={[accounts[1]]} listings={listings} onUnlink={vi.fn()} onDelete={vi.fn().mockRejectedValue(new Error('Cabut tautan terlebih dahulu'))}/>);
    await user.click(screen.getByRole('button',{name:'Hapus akun mitra mitra_02'}));await user.click(screen.getByRole('button',{name:'Ya, hapus akun'}));expect(within(screen.getByRole('dialog')).getByRole('alert').textContent).toBe('Cabut tautan terlebih dahulu');expect(screen.getByText('mitra_02',{selector:'p',exact:true})).toBeTruthy();
  });
  it('shows progress in the dialog, blocks double submission, and permits retry after failure',async()=>{
    let fail!:(error:Error)=>void;const onDelete=vi.fn().mockImplementationOnce(()=>new Promise<void>((_resolve,reject)=>{fail=reject;})).mockResolvedValue(undefined);
    const user=userEvent.setup();render(<PartnerAccountsPanel accounts={accounts} listings={listings} onUnlink={vi.fn()} onDelete={onDelete}/>);
    await user.click(screen.getByRole('button',{name:'Hapus akun mitra mitra_02'}));await user.click(screen.getByRole('button',{name:'Ya, hapus akun'}));
    const dialog=screen.getByRole('dialog');expect(within(dialog).getByRole('status').textContent).toBe('Menghapus akun mitra…');expect((within(dialog).getByRole('button',{name:'Batal'}) as HTMLButtonElement).disabled).toBe(true);
    await user.click(screen.getByRole('button',{name:'Menghapus…'}));expect(onDelete).toHaveBeenCalledOnce();
    await act(async()=>fail(new Error('Koneksi terputus')));expect(within(dialog).getByRole('alert').textContent).toBe('Koneksi terputus');
    await user.click(screen.getByRole('button',{name:'Ya, hapus akun'}));expect(onDelete).toHaveBeenCalledTimes(2);expect(screen.queryByRole('dialog')).toBeNull();
  });
});
