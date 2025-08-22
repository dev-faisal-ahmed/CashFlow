"use client";

import { FC } from "react";
import { DeleteDialog } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePopupState } from "@/lib/hooks";
import { deleteSourceApi } from "../source.api";
import { queryKeys } from "@/lib/query.keys";

type DeleteSourceProps = { sourceId: string };

export const DeleteSource: FC<DeleteSourceProps> = ({ sourceId }) => {
  const mutationKey = `delete-${queryKeys.source}-${sourceId}`;
  const queryClient = useQueryClient();

  const { open, onOpenChange } = usePopupState();
  const { mutate } = useMutation({ mutationKey: [mutationKey], mutationFn: deleteSourceApi });

  const handleDelete = () => {
    mutate(sourceId, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [queryKeys.source] });
        onOpenChange(false);
      },
    });
  };

  return (
    <>
      <Button variant="destructive_ghost" className="w-full justify-start" onClick={() => onOpenChange(true)}>
        <Trash2Icon /> Delete Source
      </Button>

      <DeleteDialog open={open} onOpenChange={onOpenChange} mutationKey={mutationKey} onDelete={handleDelete} />
    </>
  );
};
