import { useForm } from "react-hook-form";
import { TAddWalletForm, TUpdateWalletForm, TWalletTransferForm } from "./wallet-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addWalletFormSchema, updateWalletFormSchema } from "./wallet-schema";
import { usePopupState } from "@/lib/hooks";
import { QK } from "@/lib/query-keys";
import { addWallet, deleteWallet, updateWallet, walletTransfer } from "./wallet-api";
import { toast } from "sonner";

// Add Wallet
export const useAddWallet = () => {
  const mutationKey = `ADD_${QK.WALLET}`;
  const qc = useQueryClient();
  const { open, onOpenChange } = usePopupState();

  const form = useForm<TAddWalletForm>({
    resolver: zodResolver(addWalletFormSchema),
    defaultValues: { name: "", isSaving: false },
  });

  const { mutate } = useMutation({ mutationKey: [mutationKey], mutationFn: addWallet });

  const handleAddWallet = form.handleSubmit((formData) => {
    mutate(formData, {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: [QK.WALLET] });
        onOpenChange(false);
        form.reset();
      },
    });
  });

  return { form, handleAddWallet, open, onOpenChange, mutationKey };
};

// Update Wallet
export type TUseUpdateWalletArgs = { walletId: string; name: string; isSaving: boolean; onSuccess: () => void };
export const useUpdateWallet = ({ walletId, name, isSaving, onSuccess }: TUseUpdateWalletArgs) => {
  const mutationKey = `UPDATE_${QK.WALLET}_${walletId}`;
  const qc = useQueryClient();
  const { open, onOpenChange } = usePopupState();

  const form = useForm<TUpdateWalletForm>({ defaultValues: { name, isSaving }, resolver: zodResolver(updateWalletFormSchema) });
  const { mutate } = useMutation({ mutationKey: [mutationKey], mutationFn: updateWallet });

  const handleUpdateWallet = form.handleSubmit((formData) => {
    mutate(
      { ...formData, walletId },
      {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: [QK.WALLET] });
          onOpenChange(false);
          form.reset();
          onSuccess();
        },
      },
    );
  });

  return { form, handleUpdateWallet, open, onOpenChange, mutationKey };
};

// Delete Wallet
export const useDeleteWallet = (walletId: string) => {
  const mutationKey = `DELETE_${QK.WALLET}_${walletId}`;
  const qc = useQueryClient();
  const { open, onOpenChange } = usePopupState();

  const { mutate } = useMutation({ mutationKey: [mutationKey], mutationFn: deleteWallet });

  const handleDeleteWallet = () => {
    mutate(walletId, {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: [QK.WALLET] });
        onOpenChange(false);
      },
    });
  };

  return { open, onOpenChange, handleDeleteWallet, mutationKey };
};

// Wallet Transfer
export const useWalletTransfer = (walletId: string, balance: number) => {
  const FORM_ID = `TRANSFER_${QK.WALLET}_${walletId}`;
  const qc = useQueryClient();

  const { open, onOpenChange } = usePopupState();
  const { mutate } = useMutation({ mutationKey: [FORM_ID], mutationFn: walletTransfer });

  const handleTransferWallet = (formData: TWalletTransferForm, onReset: () => void) => {
    if (formData.amount > balance) return toast.error("Insufficient balance");

    mutate(
      { ...formData, sourceWalletId: walletId },
      {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: [QK.WALLET, QK.TRANSACTION] });
          onOpenChange(false);
          onReset();
        },
      },
    );
  };

  return { open, onOpenChange, handleTransferWallet, FORM_ID };
};
