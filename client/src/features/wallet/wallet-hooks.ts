import { useForm } from "react-hook-form";
import { TWalletForm } from "./wallet-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { walletFormSchema } from "./wallet-schema";
import { usePopupState } from "@/lib/hooks";
import { QK } from "@/lib/query-keys";
import { addWallet } from "./wallet-api";

export const useAddWallet = () => {
  const mutationKey = `ADD_${QK.WALLET}`;
  const qc = useQueryClient();

  const { open, onOpenChange } = usePopupState();

  const form = useForm<TWalletForm>({
    resolver: zodResolver(walletFormSchema),
    defaultValues: { name: "", isSaving: false },
  });

  const { mutate } = useMutation({ mutationKey: [mutationKey], mutationFn: addWallet });

  const handleAddWallet = form.handleSubmit((formData) => {
    mutate(formData, {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: [QK.WALLET] });
        onOpenChange(false);
      },
    });
  });

  return { form, handleAddWallet, states: { open, onOpenChange } };
};
