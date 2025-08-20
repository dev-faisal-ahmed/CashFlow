"use client";

import { FC } from "react";
import { Button } from "@/components/ui/button";
import { PencilLineIcon } from "lucide-react";
import { FormDialog } from "@/components/shared/form";
import { SourceForm } from "./source-form";
import { EBudgetInterval, ESourceType } from "@/server/modules/source/source.interface";
import { queryKeys } from "@/lib/query.keys";
import { useUpdateSource } from "../source.hook";

interface UpdateSourceProps {
  _id: string;
  name: string;
  budget?: { amount: number; interval: EBudgetInterval };
  type: ESourceType;
  onSuccess: () => void;
}

export const UpdateSource: FC<UpdateSourceProps> = ({ _id, name, budget, type, onSuccess }) => {
  const mutationKey = `update-${queryKeys.source}-${_id}`;
  const { open, onOpenChange, handleUpdateSource } = useUpdateSource({ id: _id, mutationKey, onSuccess });

  return (
    <>
      <Button variant="ghost" className="w-full justify-start" onClick={() => onOpenChange(true)}>
        <PencilLineIcon className="size-4" /> Update Source
      </Button>

      <FormDialog
        open={open}
        onOpenChange={onOpenChange}
        formId={mutationKey}
        title="Update Source"
        description="Fill up the form to update a source"
      >
        <SourceForm
          formId={mutationKey}
          mode="update"
          onSubmit={handleUpdateSource}
          defaultValues={{ name, type, addBudget: !!budget, budget }}
        />
      </FormDialog>
    </>
  );
};
