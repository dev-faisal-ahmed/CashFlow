"use client";

import { FormDialog } from "@/components/shared/form";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useAddContact } from "../contact-hook";
import { ContactForm } from "./contact-form";

export const AddContact = () => {
  const { handleAddContact, open, onOpenChange, mutationKey } = useAddContact();

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
