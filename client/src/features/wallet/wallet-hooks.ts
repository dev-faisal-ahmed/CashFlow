import { useForm } from "react-hook-form";
import { TAddWalletForm, TUpdateWalletForm } from "./wallet-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addWalletFormSchema, updateWalletFormSchema } from "./wallet-schema";
import { usePopupState } from "@/lib/hooks";
import { QK } from "@/lib/query-keys";
import { addWallet, updateWallet } from "./wallet-api";

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

  return { form, handleAddWallet, popup: { open, onOpenChange }, mutationKey };
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

  return { form, handleUpdateWallet, popup: { open, onOpenChange }, mutationKey };
};
