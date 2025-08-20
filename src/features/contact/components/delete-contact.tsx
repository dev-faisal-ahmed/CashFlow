"use client";

import { FC } from "react";
import { DeleteDialog, TooltipContainer } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { useDeleteContact } from "../contact.hook";
import { queryKeys } from "@/lib/query.keys";

export const DeleteContact: FC<{ contactId: string }> = ({ contactId }) => {
  const mutationKey = `delete-${queryKeys.contact}-${contactId}`;
  const { open, onOpenChange, handleDeleteContact } = useDeleteContact({ mutationKey, id: contactId });

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
