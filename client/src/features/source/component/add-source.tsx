"use client";

import { useForm } from "react-hook-form";
import { TSourceForm } from "../source-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { sourceSchema } from "../source-schema";
import { usePopupState } from "@/lib/hooks";
import { FormDialog } from "@/components/shared/form";
import { Form } from "@/components/ui/form";
import { QK } from "@/lib/query-keys";
import { SourceFormFields } from "./source-form-fields";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

export const AddSource = () => {
  const form = useForm<TSourceForm>({ resolver: zodResolver(sourceSchema), defaultValues: { name: "", addBudget: false } });
  const { open, onOpenChange } = usePopupState();
  const mutationKey = `ADD_${QK.SOURCE}`;

  const handleAddSource = form.handleSubmit((data) => {
    console.log(data);
  });

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
          <form onSubmit={handleAddSource} className="mt-2 flex flex-col gap-4">
            <SourceFormFields />
          </form>
        </Form>
      </FormDialog>
    </>
  );
};
