"use client";

import { FC } from "react";
import { queryKeys } from "@/lib/query.keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePeerTransactionApi } from "../../transaction.api";
import { usePopupState } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { DeleteDialog, TooltipContainer } from "@/components/shared";

export const DeletePeerTransaction: FC<{ id: string }> = ({ id }) => {
  const mutationKey = `delete-${queryKeys.transaction.peer}-${id}`;
  const queryClient = useQueryClient();

  const { open, onOpenChange } = usePopupState();
  const { mutate } = useMutation({ mutationKey: [mutationKey], mutationFn: deletePeerTransactionApi });

  const handleDelete = () => {
    mutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [queryKeys.transaction.peer] });
        queryClient.invalidateQueries({ queryKey: [queryKeys.wallet] });
        queryClient.invalidateQueries({ queryKey: [queryKeys.contact] });
        onOpenChange(false);
      },
    });
  };

  return (
    <>
      <TooltipContainer label="Delete Transaction">
        <Button variant="destructive_outline" size="icon" className="" onClick={() => onOpenChange(true)}>
          <Trash2Icon className="size-4" />
        </Button>
      </TooltipContainer>

      <DeleteDialog open={open} onOpenChange={onOpenChange} mutationKey={mutationKey} onDelete={handleDelete} />
    </>
  );
};
