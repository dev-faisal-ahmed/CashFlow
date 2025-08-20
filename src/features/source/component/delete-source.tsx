"use client";

import { FC } from "react";
import { DeleteDialog } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { useDeleteSource } from "../source.hook";
import { queryKeys } from "@/lib/query.keys";

type DeleteSourceProps = { sourceId: string };

export const DeleteSource: FC<DeleteSourceProps> = ({ sourceId }) => {
  const mutationKey = `delete-${queryKeys.source}-${sourceId}`;
  const { open, onOpenChange, handleDelete } = useDeleteSource({ mutationKey, id: sourceId });

  return (
    <>
      <Button variant="destructive_ghost" className="w-full justify-start" onClick={() => onOpenChange(true)}>
        <Trash2Icon /> Delete Source
      </Button>

      <DeleteDialog open={open} onOpenChange={onOpenChange} mutationKey={mutationKey} onDelete={handleDelete} />
    </>
  );
};
