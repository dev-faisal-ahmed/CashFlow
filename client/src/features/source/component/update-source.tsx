import { TSource } from "@/lib/types";
import { FC } from "react";
import { useUpdateSource } from "../source-hooks";
import { Button } from "@/components/ui/button";
import { PencilLineIcon } from "lucide-react";
import { FormDialog } from "@/components/shared/form";
import { SourceForm } from "./source-form";

type UpdateSourceProps = Pick<TSource, "_id" | "name" | "budget" | "type"> & { onSuccess: () => void };

export const UpdateSource: FC<UpdateSourceProps> = ({ _id, name, budget, type, onSuccess }) => {
  const { open, onOpenChange, mutationKey, handleUpdateSource } = useUpdateSource({ sourceId: _id, onSuccess });

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
          defaultValues={{ name, type, budget, addBudget: !!budget }}
        />
      </FormDialog>
    </>
  );
};
