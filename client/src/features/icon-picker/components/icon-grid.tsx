"use client";

import { useVirtual } from "../icon-picker-hook";
import { IconType } from "../icon-types";
import { cn } from "@/lib/utils";
import { FC } from "react";

type IconGridProps = { icons: IconType[]; value?: string; onSelect: (value: string) => void };

export const IconGrid: FC<IconGridProps> = ({ icons, value, onSelect }) => {
  const itemsPerRow = 4;
  const totalRows = Math.ceil(icons.length / itemsPerRow);
  const { parentRef, rowVirtualizer } = useVirtual(totalRows);

  return (
    <div ref={parentRef} className="max-h-64 overflow-y-auto rounded border px-1" style={{ height: 256 }}>
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          position: "relative",
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const startIndex = virtualRow.index * itemsPerRow;
          const rowIcons = icons.slice(startIndex, startIndex + itemsPerRow);

          return (
            <div
              key={virtualRow.index}
              ref={rowVirtualizer.measureElement}
              className="absolute top-0 left-0 grid w-full grid-cols-4 gap-2"
              style={{
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              {rowIcons.map((icon) => (
                <IconButton key={icon.name} icon={icon} selected={icon.name === value} onClick={() => onSelect(icon.name)} />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

type IconButtonProps = { icon: IconType; selected?: boolean; onClick: () => void };
const IconButton: FC<IconButtonProps> = ({ icon, selected, onClick }) => {
  const Icon = icon.icon;
  return (
    <button className={cn("hover:bg-muted flex flex-col items-center gap-1 rounded p-2", selected && "bg-muted")} onClick={onClick}>
      <div className="bg-primary rounded-md p-2">
        <Icon className="size-4" />
      </div>
      <span className="truncate text-xs">{icon.name}</span>
    </button>
  );
};
