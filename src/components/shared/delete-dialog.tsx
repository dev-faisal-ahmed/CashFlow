import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { useIsMutating } from "@tanstack/react-query";
import { FC } from "react";

type TDeleteDialogProps = {
  mutationKey: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  onDelete: () => void;
};

export const DeleteDialog: FC<TDeleteDialogProps> = ({
  mutationKey,
  open,
  onOpenChange,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  onDelete,
}) => {
  const isMutating = !!useIsMutating({ mutationKey: [mutationKey] });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button isLoading={isMutating} variant="destructive" onClick={onDelete}>
            {isMutating ? "Deleting..." : "Delete"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
