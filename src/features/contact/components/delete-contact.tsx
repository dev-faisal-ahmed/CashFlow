"use client";

import { FC } from "react";
import { DeleteDialog, TooltipContainer } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { contactClient } from "@/lib/client";
import { usePopupState } from "@/lib/hooks";
import { queryKeys } from "@/lib/query.keys";
import { useMutation } from "@tanstack/react-query";
import { Trash2Icon } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export const DeleteContact: FC<{ contactId: string }> = ({ contactId }) => {
  const mutationKey = `delete-${queryKeys.contact}-${contactId}`;
  const queryClient = useQueryClient();

  const { open, onOpenChange } = usePopupState();
  const { mutate } = useMutation({ mutationKey: [mutationKey], mutationFn: deleteContactApi });

  const handleDeleteContact = () => {
    mutate(contactId, {
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

// Api Calling
const deleteContactApi = async (contactId: string) => {
  const res = await contactClient[":id"].$delete({ param: { id: contactId } });
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  return resData;
};
