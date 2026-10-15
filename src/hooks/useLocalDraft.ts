import { useLayoutEffect, useState, type SetStateAction } from "react";

export const DRAFT_PREFIX = "woloan:draft:v1:";

interface DraftRecord<T> {
  version: 1;
  revision: string;
  value: T;
}
interface DraftState<T> {
  signature: string;
  value: T;
  dirty: boolean;
  saved: boolean;
  restored: boolean;
  older: T | null;
  error: boolean;
}

export function draftKey(accountId: string, role: "admin" | "mitra", kind: string, listingId: string) {
  return [accountId, role, kind, listingId].map(encodeURIComponent).join(":");
}

// Only listing fields belong here; callers never pass login or password fields.
// Layout effects flush each committed edit before paint, without a debounce window
// that could lose the most recent input when the user immediately reloads.
export function useLocalDraft<T>({ storageKey, revision, initialValue, validate }: {
  storageKey: string | null;
  revision: string;
  initialValue: T;
  validate: (value: unknown) => value is T;
}) {
  const signature = JSON.stringify([storageKey, revision]);
  const load = (): DraftState<T> => {
    const state: DraftState<T> = { signature, value: initialValue, dirty: false, saved: false, restored: false, older: null, error: false };
    if (!storageKey) return state;
    try {
      const raw = localStorage.getItem(DRAFT_PREFIX + storageKey);
      if (!raw) return state;
      let record: DraftRecord<T>;
      try { record = JSON.parse(raw); } catch { return state; }
      if (!record || record.version !== 1 || typeof record.revision !== "string" || !validate(record.value)) return state;
      if (record.revision !== revision) return { ...state, older: record.value };
      return { ...state, value: record.value, saved: true, restored: true };
    } catch { return { ...state, error: true }; }
  };
  const [state, setState] = useState<DraftState<T>>(load);
  if (state.signature !== signature) setState(load());

  useLayoutEffect(() => {
    if (!storageKey || state.signature !== signature || !state.dirty) return;
    try {
      localStorage.setItem(DRAFT_PREFIX + storageKey, JSON.stringify({ version: 1, revision, value: state.value }));
      // Report the result of the external storage write, rather than assuming it succeeded.
      // eslint-disable-next-line react/set-state-in-effect
      if (!state.saved || state.error) setState(previous => ({ ...previous, saved: true, error: false }));
    } catch {
      if (!state.error || state.saved) setState(previous => ({ ...previous, saved: false, error: true }));
    }
  }, [storageKey, revision, signature, state]);

  const setValue = (action: SetStateAction<T>) => setState(previous => {
    if (previous.signature !== signature) return previous;
    const value = typeof action === "function" ? (action as (previous: T) => T)(previous.value) : action;
    return { ...previous, value, dirty: true, older: null };
  });
  const clear = (value = initialValue) => {
    let failed = false;
    try { if (storageKey) localStorage.removeItem(DRAFT_PREFIX + storageKey); } catch { failed = true; }
    setState(previous => previous.signature !== signature ? previous : {
      signature, value, dirty: failed, saved: false, restored: false, older: null, error: failed,
    });
  };
  return {
    value: state.signature === signature ? state.value : initialValue,
    setValue,
    clear,
    saved: state.saved,
    restored: state.restored,
    error: state.error,
    hasOlderDraft: state.older !== null,
    restoreOlder: () => { if (state.older !== null) setValue(state.older); },
  };
}
