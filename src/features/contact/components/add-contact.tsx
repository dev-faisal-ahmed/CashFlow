"use client";

import { FormDialog } from "@/components/shared/form";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { ContactForm } from "./contact-form";
import { queryKeys } from "@/lib/query.keys";
import { useAddContact } from "../contact.hooks";

const mutationKey = `add-${queryKeys.contact}`;

export const AddContact = () => {
  const { open, onOpenChange, handleAddContact } = useAddContact(mutationKey);

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
