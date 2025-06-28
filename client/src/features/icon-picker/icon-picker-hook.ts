import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";

export const useVirtual = (totalRows: number) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: totalRows,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 72,
    overscan: 5,
  });

  return { parentRef, rowVirtualizer };
};
