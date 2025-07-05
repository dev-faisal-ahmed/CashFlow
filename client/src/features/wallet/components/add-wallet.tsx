"use client";

import { FormDialog } from "@/components/shared/form/form-dialog";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useAddWallet } from "../wallet-hooks";
import { WalletFormFields } from "./wallet-form-fields";
import { Form } from "@/components/ui/form";

export const AddWallet = () => {
  const {
    form,
    handleAddWallet,
    popup: { open, onOpenChange },
    mutationKey,
  } = useAddWallet();

  return (
    <>
      <Button onClick={() => onOpenChange(true)}>
        <PlusIcon className="size-4" /> Add Wallet
      </Button>

      <FormDialog
        open={open}
        onOpenChange={onOpenChange}
        formId={mutationKey}
        title="Add New Wallet"
        description="Fill up the form to create a wallet"
      >
        <Form {...form}>
          <form id={mutationKey} onSubmit={handleAddWallet} className="mt-2 flex flex-col gap-4">
            <WalletFormFields mode="add" />
          </form>
        </Form>
      </FormDialog>
    </>
  );
};
