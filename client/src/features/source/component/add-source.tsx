"use client";

import { FormDialog } from "@/components/shared/form";
import { Form } from "@/components/ui/form";
import { SourceFormFields } from "./source-form-fields";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useAddSource } from "../source-hooks";

export const AddSource = () => {
  const { form, handleAddSource, open, onOpenChange, mutationKey } = useAddSource();

  return (
    <>
      <Button onClick={() => onOpenChange(true)}>
        <PlusIcon className="size-4" /> Add Source
      </Button>

      <FormDialog
        open={open}
        onOpenChange={onOpenChange}
        title="Add Source"
        description="Fill up the form to create a source"
        formId={mutationKey}
      >
        <Form {...form}>
          <form id={mutationKey} onSubmit={handleAddSource} className="mt-2 flex flex-col gap-4">
            <SourceFormFields />
          </form>
        </Form>
      </FormDialog>
    </>
  );
};
