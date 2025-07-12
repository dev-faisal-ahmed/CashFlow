"use client";

import { FormDialog } from "@/components/shared/form";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useAddSource } from "../source-hook";
import { SourceForm } from "./source-form";

export const AddSource = () => {
  const { handleAddSource, open, onOpenChange, mutationKey } = useAddSource();

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
        <SourceForm mode="add" formId={mutationKey} defaultValues={{ name: "", type: "", addBudget: false }} onSubmit={handleAddSource} />
      </FormDialog>
    </>
  );
};
