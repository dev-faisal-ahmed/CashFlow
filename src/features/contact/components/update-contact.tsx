"use client";

import { FC } from "react";
import { queryKeys } from "@/lib/query.keys";
import { ContactForm } from "./contact-form";
import { Button } from "@/components/ui/button";
import { PencilLineIcon } from "lucide-react";
import { FormDialog } from "@/components/shared/form";
import { TooltipContainer } from "@/components/shared/tooltip-container";
import { useQueryClient } from "@tanstack/react-query";
import { usePopupState } from "@/lib/hooks";
import { useMutation } from "@tanstack/react-query";
import { updateContactApi } from "../contact.api";
import { TContactFormData } from "../contact.schema";
import { TContact } from "@/server/db/schema";

type UpdateContactProps = Pick<TContact, "id" | "name" | "phone" | "address">;

export const UpdateContact: FC<UpdateContactProps> = ({ id, name, phone, address }) => {
  const mutationKey = `update-${queryKeys.contact}-${id}`;
  const queryClient = useQueryClient();

  const { open, onOpenChange } = usePopupState();
  const { mutate } = useMutation({ mutationKey: [mutationKey], mutationFn: updateContactApi });

  const handleUpdateContact = (formData: TContactFormData, onReset: () => void) => {
    mutate(
      { id: id.toString(), name: formData.name, address: formData.address },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [queryKeys.contact] });
          onReset();
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <>
      <TooltipContainer label="Update Contact">
        <Button variant="outline" size="icon" onClick={() => onOpenChange(true)}>
          <PencilLineIcon className="size-4" />
        </Button>
      </TooltipContainer>

      <FormDialog
        open={open}
        onOpenChange={onOpenChange}
        formId={mutationKey}
        title="Update Contact"
        description="Fill up the form to update a contact"
      >
        <ContactForm
          formId={mutationKey}
          defaultValues={{ name, phone, address: address ?? "" }}
          onSubmit={handleUpdateContact}
          mode="edit"
        />
      </FormDialog>
    </>
  );
};
