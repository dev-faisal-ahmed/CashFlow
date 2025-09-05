"use client";

import { FormDialog } from "@/components/shared/form";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { queryKeys } from "@/lib/query.keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePopupState } from "@/lib/hooks";
import { addCategoryApi } from "../category.api";
import { TCategoryFormData } from "../category.schema";
import { CategoryForm } from "./category-form";
import { ECategoryType } from "@/server/db/schema";

const mutationKey = `add-${queryKeys.category}`;

export const AddCategory = () => {
  const queryClient = useQueryClient();
  const { open, onOpenChange } = usePopupState();
  const { mutate } = useMutation({ mutationKey: [mutationKey], mutationFn: addCategoryApi });

  const handleAddCategory = (formData: TCategoryFormData, onReset: () => void) => {
    mutate(
      { name: formData.name, type: formData.type, ...(formData.addBudget && { budget: formData.budget }) },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [queryKeys.category] });
          onReset();
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <>
      <Button onClick={() => onOpenChange(true)}>
        <PlusIcon className="size-4" />
        <span className="hidden md:block">Add Category</span>
      </Button>

      <FormDialog
        open={open}
        onOpenChange={onOpenChange}
        title="Add Category"
        description="Fill up the form to create a category"
        formId={mutationKey}
      >
        <CategoryForm
          mode="add"
          formId={mutationKey}
          defaultValues={{ name: "", type: ECategoryType.income, addBudget: false }}
          onSubmit={handleAddCategory}
        />
      </FormDialog>
    </>
  );
};
