"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormDialog } from "@/components/shared/form";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { ContactForm, TContactFormData } from "./contact-form";
import { CreateContactDto } from "@/server/modules/contact/contact.validation";
import { usePopupState } from "@/lib/hooks";
import { contactClient } from "@/lib/client";
import { queryKeys } from "@/lib/query.keys";

const mutationKey = `add-${queryKeys.contact}`;

export const AddContact = () => {
  const queryClient = useQueryClient();

  const { open, onOpenChange } = usePopupState();
  const { mutate } = useMutation({ mutationKey: [mutationKey], mutationFn: createContact });

  const handleAddContact = (formData: TContactFormData, onReset: () => void) => {
    mutate(
      { ...formData, ...(formData.address && { address: formData.address }) },
      {
        onSuccess: () => {
          onReset();
          queryClient.invalidateQueries({ queryKey: [queryKeys.contact] });
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <>
      <Button onClick={() => onOpenChange(true)}>
        <PlusIcon className="size-4" /> Add Contact
      </Button>

      <FormDialog
        open={open}
        onOpenChange={onOpenChange}
        formId={mutationKey}
        title="Add New Contact"
        description="Fill up the form to create a new contact"
      >
        <ContactForm formId={mutationKey} defaultValues={{ name: "", phone: "", address: "" }} onSubmit={handleAddContact} />
      </FormDialog>
    </>
  );
};

// Api Calling
const createContact = async (payload: CreateContactDto) => {
  const res = await contactClient.index.$post({ json: payload });
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  return resData;
};
