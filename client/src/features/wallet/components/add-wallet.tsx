"use client";

import { FormDialog } from "@/components/shared/form";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useAddWallet } from "../wallet-hook";
import { WalletForm } from "./wallet-form";

export const AddWallet = () => {
  const { handleAddWallet, open, onOpenChange, mutationKey } = useAddWallet();

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
        <WalletForm formId={mutationKey} mode="add" defaultValues={{ name: "", isSaving: false }} onSubmit={handleAddWallet} />
        {/* <Form {...form}>
          <form id={mutationKey} onSubmit={handleAddWallet} className="mt-2 flex flex-col gap-4">
            <WalletFormFields mode="add" />
          </form>
        </Form> */}
      </FormDialog>
    </>
  );
};
