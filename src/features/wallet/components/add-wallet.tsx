"use client";

import { FormDialog } from "@/components/shared/form";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { WalletForm } from "./wallet-form";
import { queryKeys } from "@/lib/query.keys";
import { useQueryClient } from "@tanstack/react-query";
import { usePopupState } from "@/lib/hooks";
import { useMutation } from "@tanstack/react-query";
import { addWalletApi } from "../wallet.api";
import { TAddWalletFormData, TWalletFormData } from "../wallet.schema";

const mutationKey = `add-${queryKeys.wallet}`;

export const AddWallet = () => {
  const queryClient = useQueryClient();

  const { open, onOpenChange } = usePopupState();
  const { mutate } = useMutation({ mutationKey: [mutationKey], mutationFn: addWalletApi });

  const handleAddWallet = (formData: TWalletFormData, onReset: () => void) => {
    const payload = formData as TAddWalletFormData;

    mutate(payload, {
      onSuccess: () => {
        onReset();
        queryClient.invalidateQueries({ queryKey: [queryKeys.wallet] });
        onOpenChange(false);
      },
    });
  };

  return (
    <>
      <Button onClick={() => onOpenChange(true)}>
        <PlusIcon className="size-4" />
        <span className="hidden md:block">Add Wallet</span>
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
