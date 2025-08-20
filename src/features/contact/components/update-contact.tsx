"use client";

import { FC } from "react";
import { queryKeys } from "@/lib/query.keys";
import { ContactForm } from "./contact-form";
import { Button } from "@/components/ui/button";
import { PencilLineIcon } from "lucide-react";
import { FormDialog } from "@/components/shared/form";
import { TooltipContainer } from "@/components/shared/tooltip-container";
import { useUpdateContact } from "../contact.hook";

type UpdateContactProps = {
  contactId: string;
  name: string;
  phone: string;
  address?: string;
};

export const UpdateContact: FC<UpdateContactProps> = ({ contactId, name, phone, address }) => {
  const mutationKey = `update-${queryKeys.contact}-${contactId}`;
  const { open, onOpenChange, handleUpdateContact } = useUpdateContact({ mutationKey, id: contactId });

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
