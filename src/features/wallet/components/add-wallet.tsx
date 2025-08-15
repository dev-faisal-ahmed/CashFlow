"use client";

import { FormDialog } from "@/components/shared/form";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { TWalletFormData, WalletForm } from "./wallet-form";
import { usePopupState } from "@/lib/hooks";
import { queryKeys } from "@/lib/query.keys";
import { addWallet } from "../wallet-api";
import { useMutation } from "@tanstack/react-query";
import { TAddWalletFormData } from "../wallet-schema";

const mutationKey = `add-${queryKeys.wallet}`;

export const AddWallet = () => {
  const { open, onOpenChange } = usePopupState();
  const { mutate } = useMutation({ mutationKey: [mutationKey], mutationFn: addWallet });

  const handleAddWallet = (formData: TWalletFormData, onReset: () => void) => {
    const payload = formData as TAddWalletFormData;

    mutate(payload, {
      onSuccess: () => {
        onReset();
        onOpenChange(false);
      },
    });
  };

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
