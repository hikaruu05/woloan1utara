import { useRef, useState } from "react";

// A ref prevents a second click or file change before React disables the form.
export function useTask() {
  const locked = useRef(false);
  const [label, setLabel] = useState("");
  const run = async (message: string, action: () => Promise<void>) => {
    if (locked.current) return;
    locked.current = true;
    setLabel(message);
    try { await action(); }
    finally { locked.current = false; setLabel(""); }
  };
  return { busy: Boolean(label), label, run };
}
