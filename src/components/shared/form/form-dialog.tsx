"use client";

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../ui/dialog";
import { useIsMutating } from "@tanstack/react-query";
import { FC, ReactNode } from "react";
import { Button } from "../../ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { XIcon } from "lucide-react";

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
      <DialogContent className="p-0" showCloseButton={false}>
        <ScrollArea className="max-h-[100dvh] px-6 sm:max-h-[100vh]">
          <DialogHeader className="mb-6 pt-6">
            <section className="flex items-center justify-between">
              <DialogTitle>{title}</DialogTitle>
              <DialogClose
                data-slot="dialog-close"
                className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
              >
                <XIcon />
                <span className="sr-only">Close</span>
              </DialogClose>
            </section>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          {children}
          <DialogFooter className="mt-6 pb-6">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button form={formId} type="submit" isLoading={!!isMutating}>
              {!!isMutating ? <>{submitLoadingTitle || "Submitting..."}</> : <>{submitButtonTitle || "Submit"}</>}
            </Button>
          </DialogFooter>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
