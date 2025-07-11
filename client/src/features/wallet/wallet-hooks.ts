import { TAddWalletForm, TUpdateWalletForm, TWalletForm, TWalletTransferForm } from "./wallet-type";
import { addWallet, deleteWallet, updateWallet, walletTransfer } from "./wallet-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePopupState } from "@/lib/hooks";
import { QK } from "@/lib/query-keys";
import { toast } from "sonner";

// Add Wallet
export const useAddWallet = () => {
  const mutationKey = `ADD_${QK.WALLET}`;
  const qc = useQueryClient();

  const { open, onOpenChange } = usePopupState();
  const { mutate } = useMutation({ mutationKey: [mutationKey], mutationFn: addWallet });

  const handleAddWallet = (formData: TWalletForm, onReset: () => void) => {
    const { name, isSaving, initialBalance } = formData as TAddWalletForm;

    mutate(
      { name, isSaving, initialBalance },
      {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: [QK.WALLET] });
          onReset();
          onOpenChange(false);
        },
      },
    );
  };

  return { handleAddWallet, open, onOpenChange, mutationKey };
};

// Update Wallet
export type TUseUpdateWalletArgs = { walletId: string; onSuccess: () => void };
export const useUpdateWallet = ({ walletId, onSuccess }: TUseUpdateWalletArgs) => {
  const mutationKey = `UPDATE_${QK.WALLET}_${walletId}`;
  const qc = useQueryClient();
  const { open, onOpenChange } = usePopupState();

  const { mutate } = useMutation({ mutationKey: [mutationKey], mutationFn: updateWallet });

  const handleUpdateWallet = (formData: TWalletForm, onReset: () => void) => {
    const data = formData as TUpdateWalletForm;
    mutate(
      { ...data, walletId },
      {
        onSuccess: () => {
          onReset();
          qc.invalidateQueries({ queryKey: [QK.WALLET] });
          onOpenChange(false);
          onSuccess();
        },
      },
    );
  };

  return { handleUpdateWallet, open, onOpenChange, mutationKey };
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
