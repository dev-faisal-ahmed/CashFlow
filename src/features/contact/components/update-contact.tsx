"use client";

import { FC } from "react";
import { contactClient } from "@/lib/client";
import { usePopupState } from "@/lib/hooks";
import { queryKeys } from "@/lib/query.keys";
import { UpdateContactDto } from "@/server/modules/contact/contact.validation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ContactForm, TContactFormData } from "./contact-form";
import { Button } from "@/components/ui/button";
import { PencilLineIcon } from "lucide-react";
import { FormDialog } from "@/components/shared/form";
import { TooltipContainer } from "@/components/shared/tooltip-container";

type UpdateContactProps = {
  contactId: string;
  name: string;
  phone: string;
  address?: string;
};

export const UpdateContact: FC<UpdateContactProps> = ({ contactId, name, phone, address }) => {
  const mutationKey = `update-${queryKeys.contact}-${contactId}`;
  const queryClient = useQueryClient();

  const { open, onOpenChange } = usePopupState();
  const { mutate } = useMutation({ mutationKey: [mutationKey], mutationFn: updateContactApi });

  const handleUpdateContact = (formData: TContactFormData, onReset: () => void) => {
    mutate(
      { id: contactId, name: formData.name, address: formData.address },
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
        <ContactForm formId={mutationKey} defaultValues={{ name, phone, address }} onSubmit={handleUpdateContact} mode="edit" />
      </FormDialog>
    </>
  );
};

const updateContactApi = async ({ id, ...dto }: UpdateContactDto & { id: string }) => {
  const res = await contactClient[":id"].$patch({ param: { id }, json: dto });
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  return resData;
};
