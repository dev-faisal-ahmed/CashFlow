"use client";

import { FormDialog } from "@/components/shared/form";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { SourceForm } from "./source-form";
import { CreateSourceDto } from "@/server/modules/source/source.validation";
import { usePopupState } from "@/lib/hooks";
import { queryKeys } from "@/lib/query.keys";
import { sourceClient } from "@/lib/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TSourceFormData } from "../source-schema";
import { ESourceType } from "@/server/modules/source/source.interface";

const mutationKey = `add-${queryKeys.source}`;

export const AddSource = () => {
  const { open, onOpenChange } = usePopupState();
  const { mutate } = useMutation({ mutationKey: [mutationKey], mutationFn: addSourceApi });
  const queryClient = useQueryClient();

  const handleAddSource = (formData: TSourceFormData, onReset: () => void) => {
    mutate(
      { name: formData.name, type: formData.type, ...(formData.addBudget && { budget: formData.budget }) },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [queryKeys.source] });
          onReset();
          onOpenChange(false);
        },
      },
    );
  };

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

// Api
const addSourceApi = async (payload: CreateSourceDto) => {
  const res = await sourceClient.index.$post({ json: payload });
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  return resData;
};
