import { useState, useEffect, useCallback } from "react";

// Is Mobile
const MOBILE_BREAKPOINT = 768;
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
};

export const usePopupState = () => {
  const [open, setOpen] = useState(false);
  const onOpenChange = useCallback((open: boolean) => setOpen(open), []);

  return { open, onOpenChange };
};

export const useDebounce = <TValue>(value: TValue, delay = 300): TValue => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
};

export const useDebouncedSearch = () => {
  const [value, setValue] = useState("");
  const onSearchChange = useCallback((value: string) => setValue(value), []);
  const searchTerm = useDebounce(value);

  return { value, searchTerm, onSearchChange };
};

export const useSearch = () => {
  const [value, setValue] = useState("");
  const onSearchChange = useCallback((value: string) => setValue(value), []);

  return { value, onSearchChange };
};
