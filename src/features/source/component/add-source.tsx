"use client";

import { FormDialog } from "@/components/shared/form";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { SourceForm } from "./source-form";
import { queryKeys } from "@/lib/query.keys";
import { ESourceType } from "@/server/modules/source/source.interface";
import { useAddSource } from "../source.hook";

const mutationKey = `add-${queryKeys.source}`;

export const AddSource = () => {
  const { open, onOpenChange, handleAddSource } = useAddSource(mutationKey);

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
        <SourceForm
          mode="add"
          formId={mutationKey}
          defaultValues={{ name: "", type: ESourceType.income, addBudget: false }}
          onSubmit={handleAddSource}
        />
      </FormDialog>
    </>
  );
};
