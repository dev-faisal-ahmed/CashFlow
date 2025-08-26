"use client";

import { FC } from "react";
import { DeleteDialog } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePopupState } from "@/lib/hooks";
import { queryKeys } from "@/lib/query.keys";
import { deleteCategoryApi } from "../category.api";

type DeleteCategoryProps = { id: number };

export const DeleteCategory: FC<DeleteCategoryProps> = ({ id }) => {
  const mutationKey = `delete-${queryKeys.category}-${id}`;
  const queryClient = useQueryClient();

  const { open, onOpenChange } = usePopupState();
  const { mutate } = useMutation({ mutationKey: [mutationKey], mutationFn: deleteCategoryApi });

  const handleDelete = () => {
    mutate(id.toString(), {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [queryKeys.category] });
        onOpenChange(false);
      },
    });
  };

  return (
    <>
      <Button variant="destructive_ghost" className="w-full justify-start" onClick={() => onOpenChange(true)}>
        <Trash2Icon /> Delete Category
      </Button>

      <DeleteDialog open={open} onOpenChange={onOpenChange} mutationKey={mutationKey} onDelete={handleDelete} />
    </>
  );
};
