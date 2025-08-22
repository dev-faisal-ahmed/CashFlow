"use client";

import { FormDialog } from "@/components/shared/form";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { ContactForm } from "./contact-form";
import { queryKeys } from "@/lib/query.keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePopupState } from "@/lib/hooks";
import { createContactApi } from "../contact.api";
import { TContactFormData } from "../contact.schema";

const mutationKey = `add-${queryKeys.contact}`;

export const AddContact = () => {
  const queryClient = useQueryClient();

  const { open, onOpenChange } = usePopupState();
  const { mutate } = useMutation({ mutationKey: [mutationKey], mutationFn: createContactApi });

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
        <ContactForm formId={mutationKey} defaultValues={{ name: "", phone: "", address: "" }} onSubmit={handleAddContact} mode="add" />
      </FormDialog>
    </>
  );
};
