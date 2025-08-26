"use client";

import { FC } from "react";
import { DeleteDialog, TooltipContainer } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { queryKeys } from "@/lib/query.keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePopupState } from "@/lib/hooks";
import { deleteContactApi } from "../contact.api";

export const DeleteContact: FC<{ id: number }> = ({ id }) => {
  const mutationKey = `delete-${queryKeys.contact}-${id}`;
  const queryClient = useQueryClient();

  const { open, onOpenChange } = usePopupState();
  const { mutate } = useMutation({ mutationKey: [mutationKey], mutationFn: deleteContactApi });

  const handleDeleteContact = () => {
    mutate(id.toString(), {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [queryKeys.contact] });
        onOpenChange(false);
      },
    });
  };

  return (
    <>
      <TooltipContainer label="Delete Contact">
        <Button variant="outline" className="text-destructive hover:text-destructive/80" size="icon" onClick={() => onOpenChange(true)}>
          <Trash2Icon />
        </Button>
      </TooltipContainer>

      <DeleteDialog open={open} onOpenChange={onOpenChange} mutationKey={mutationKey} onDelete={handleDeleteContact} />
    </>
  );
};
