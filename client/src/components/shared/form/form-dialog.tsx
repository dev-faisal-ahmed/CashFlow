"use client";

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../ui/dialog";
import { useIsMutating } from "@tanstack/react-query";
import { FC, ReactNode } from "react";
import { Button } from "../../ui/button";

type FormDialogProps = {
  formId: string;
  title: string;
  description?: string;
  children: ReactNode;
  submitButtonTitle?: string;
  submitLoadingTitle?: string;
  open: boolean;
  onOpenChange(open: boolean): void;
};

export const FormDialog: FC<FormDialogProps> = ({
  formId,
  title,
  description,
  children,
  submitButtonTitle,
  submitLoadingTitle,
  open,
  onOpenChange,
}) => {
  const isMutating = useIsMutating({ mutationKey: [formId] });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button form={formId} type="submit" isLoading={!!isMutating}>
            {!!isMutating ? <>{submitLoadingTitle || "Submitting..."}</> : <>{submitButtonTitle || "Submit"}</>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
