import React, { StrictMode } from 'react';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DRAFT_PREFIX, draftKey, useLocalDraft } from '../src/hooks/useLocalDraft';
const validate=(value:unknown):value is {name:string}=>Boolean(value)&&typeof value==='object'&&typeof (value as {name?:unknown}).name==='string';
const initialValue={name:'Server name'};
const key=draftKey('owner','mitra','stores','listing');
const options={storageKey:key,revision:'server-v1',initialValue,validate};
beforeEach(()=>localStorage.clear());
describe('automatic browser drafts',()=>{
  it('persists the latest edit before a reload, including under Strict Mode',()=>{
    const wrapper=({children}:{children:React.ReactNode})=><StrictMode>{children}</StrictMode>;
    const first=renderHook(()=>useLocalDraft(options),{wrapper});
    act(()=>first.result.current.setValue({name:'Typed just before reload'}));
    expect(JSON.parse(localStorage.getItem(DRAFT_PREFIX+key)!).value.name).toBe('Typed just before reload');
    first.unmount();const next=renderHook(()=>useLocalDraft(options),{wrapper});
    expect(next.result.current.value.name).toBe('Typed just before reload');expect(next.result.current.restored).toBe(true);
  });
  it('does not create blank drafts on initial render',()=>{
    renderHook(()=>useLocalDraft(options));expect(localStorage.getItem(DRAFT_PREFIX+key)).toBeNull();
  });
  it('keeps account, role, catalog and listing drafts separate',()=>{
    const first=renderHook(props=>useLocalDraft({...options,storageKey:props.storageKey}),{initialProps:{storageKey:key}});
    act(()=>first.result.current.setValue({name:'Owner one'}));
    for(const scope of [draftKey('other','mitra','stores','listing'),draftKey('owner','admin','stores','listing'),draftKey('owner','mitra','houses','listing'),draftKey('owner','mitra','stores','new')]){
      first.rerender({storageKey:scope});expect(first.result.current.value.name).toBe('Server name');
    }
    first.rerender({storageKey:key});expect(first.result.current.value.name).toBe('Owner one');
  });
  it('offers an old draft without overwriting newer server data',()=>{
    const first=renderHook(props=>useLocalDraft({...options,revision:props.revision}),{initialProps:{revision:'server-v1'}});
    act(()=>first.result.current.setValue({name:'Unsent draft'}));first.rerender({revision:'server-v2'});
    expect(first.result.current.value.name).toBe('Server name');expect(first.result.current.hasOlderDraft).toBe(true);
    act(()=>first.result.current.restoreOlder());expect(first.result.current.value.name).toBe('Unsent draft');
    expect(JSON.parse(localStorage.getItem(DRAFT_PREFIX+key)!).revision).toBe('server-v2');
  });
  it('clears a submitted or discarded draft without writing it back',()=>{
    const first=renderHook(()=>useLocalDraft(options));act(()=>first.result.current.setValue({name:'Draft'}));act(()=>first.result.current.clear());
    expect(first.result.current.value.name).toBe('Server name');expect(localStorage.getItem(DRAFT_PREFIX+key)).toBeNull();first.unmount();
    expect(renderHook(()=>useLocalDraft(options)).result.current.restored).toBe(false);
  });
  it('clears the submitted scope if the component has already moved to another listing',()=>{
    const first=renderHook(props=>useLocalDraft({...options,storageKey:props.storageKey}),{initialProps:{storageKey:key}});act(()=>first.result.current.setValue({name:'Draft'}));const clear=first.result.current.clear;
    first.rerender({storageKey:'another'});act(()=>first.result.current.setValue({name:'Another listing'}));act(()=>clear());
    expect(localStorage.getItem(DRAFT_PREFIX+key)).toBeNull();expect(first.result.current.value.name).toBe('Another listing');
  });
  it('warns if storage is blocked and keeps edits usable in memory',()=>{
    vi.spyOn(Storage.prototype,'setItem').mockImplementation(()=>{throw new DOMException('Quota','QuotaExceededError');});
    const first=renderHook(()=>useLocalDraft(options));act(()=>first.result.current.setValue({name:'Unsaved'}));expect(first.result.current.error).toBe(true);expect(first.result.current.saved).toBe(false);expect(first.result.current.value.name).toBe('Unsaved');
  });
  it('ignores corrupted or incompatible browser data',()=>{
    for(const raw of ['{broken',JSON.stringify(null),JSON.stringify({version:1,revision:'server-v1',value:{name:42}})]){
      localStorage.setItem(DRAFT_PREFIX+key,raw);const first=renderHook(()=>useLocalDraft(options));expect(first.result.current.value.name).toBe('Server name');first.unmount();
    }
  });
});

it('waits for account restoration without overwriting an existing draft',()=>{
  localStorage.setItem(DRAFT_PREFIX+key,JSON.stringify({version:1,revision:'server-v1',value:{name:'Before reload'}}));
  const first=renderHook(props=>useLocalDraft({...options,storageKey:props.storageKey}),{initialProps:{storageKey:null as string|null}});
  expect(first.result.current.value.name).toBe('Server name');
  first.rerender({storageKey:key});expect(first.result.current.value.name).toBe('Before reload');
});
