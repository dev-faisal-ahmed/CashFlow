"use client";

import { FC } from "react";
import { Button } from "@/components/ui/button";
import { PencilLineIcon } from "lucide-react";
import { FormDialog } from "@/components/shared/form";
import { WalletForm } from "./wallet-form";
import { usePopupState } from "@/lib/hooks";
import { queryKeys } from "@/lib/query.keys";
import { TUpdateWalletFormData, TWalletFormData } from "../wallet.schema";
import { walletClient } from "@/lib/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type UpdateWalletProps = { walletId: number; name: string; isSaving: boolean; onSuccess: () => void };
const mutationKey = `update-${queryKeys.wallet}`;

export const UpdateWallet: FC<UpdateWalletProps> = ({ walletId, name, isSaving, onSuccess }) => {
  const { open, onOpenChange } = usePopupState();
  const { mutate } = useMutation({ mutationKey: [mutationKey], mutationFn: updateWalletApi });
  const queryClient = useQueryClient();

  const handleUpdateWallet = (formData: TWalletFormData, onReset: () => void) => {
    mutate(
      { walletId, name: formData.name, isSaving: formData.isSaving },
      {
        onSuccess: () => {
          onReset();
          queryClient.invalidateQueries({ queryKey: [queryKeys.wallet] });
          onOpenChange(false);
          onSuccess();
        },
      },
    );
  };

  return (
    <>
      <Button variant="ghost" className="w-full justify-start" onClick={() => onOpenChange(true)}>
        <PencilLineIcon className="size-4" /> Update Wallet
      </Button>

      <FormDialog
        open={open}
        onOpenChange={onOpenChange}
        formId={mutationKey}
        title="Update Wallet"
        description="Fill up the form to update a wallet"
      >
        <WalletForm formId={mutationKey} mode="update" onSubmit={handleUpdateWallet} defaultValues={{ name, isSaving }} />
      </FormDialog>
    </>
  );
};

// Api calling
const updateWalletApi = async ({ walletId, ...payload }: TUpdateWalletFormData & { walletId: number }) => {
  const res = await walletClient[":id"].$patch({ param: { id: walletId.toString() }, json: payload });
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  return resData;
};
