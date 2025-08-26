"use client";

import { FC } from "react";
import { Button } from "@/components/ui/button";
import { PencilLineIcon } from "lucide-react";
import { FormDialog } from "@/components/shared/form";
import { queryKeys } from "@/lib/query.keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePopupState } from "@/lib/hooks";
import { updateCategoryApi } from "../category.api";
import { TCategoryFormData } from "../category.schema";
import { EBudgetInterval, ECategoryType } from "@/server/db/schema";
import { CategoryForm } from "./category-form";

interface UpdateCategoryProps {
  id: number;
  name: string;
  budget?: { amount: number; interval: EBudgetInterval };
  type: ECategoryType;
  onSuccess: () => void;
}

export const UpdateCategory: FC<UpdateCategoryProps> = ({ id, name, budget, type, onSuccess }) => {
  const mutationKey = `update-${queryKeys.category}-${id}`;
  const queryClient = useQueryClient();

  const { open, onOpenChange } = usePopupState();
  const { mutate } = useMutation({ mutationKey: [mutationKey], mutationFn: updateCategoryApi });

  const handleUpdateCategory = async (formData: TCategoryFormData, onReset: () => void) => {
    mutate(
      { id: id.toString(), ...formData },
      {
        onSuccess: () => {
          onReset();
          queryClient.invalidateQueries({ queryKey: [queryKeys.category] });
          onOpenChange(false);
          onSuccess();
        },
      },
    );
  };

  return (
    <>
      <Button variant="ghost" className="w-full justify-start" onClick={() => onOpenChange(true)}>
        <PencilLineIcon className="size-4" /> Update Category
      </Button>

      <FormDialog
        open={open}
        onOpenChange={onOpenChange}
        formId={mutationKey}
        title="Update Category"
        description="Fill up the form to update a category"
      >
        <CategoryForm
          formId={mutationKey}
          mode="update"
          onSubmit={handleUpdateCategory}
          defaultValues={{ name, type, addBudget: !!budget, budget }}
        />
      </FormDialog>
    </>
  );
};
