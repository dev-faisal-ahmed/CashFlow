"use client";

import { FormDialog } from "@/components/shared/form";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { WalletForm } from "./wallet-form";
import { queryKeys } from "@/lib/query.keys";
import { useAddWallet } from "../wallet.hook";

const mutationKey = `add-${queryKeys.wallet}`;

export const AddWallet = () => {
  const { open, onOpenChange, handleAddWallet } = useAddWallet(mutationKey);

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
      </FormDialog>
    </>
  );
};
