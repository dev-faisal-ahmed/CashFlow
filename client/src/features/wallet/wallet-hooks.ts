import { useForm } from "react-hook-form";
import { TWalletForm } from "./wallet-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { walletFormSchema } from "./wallet-schema";
import { usePopupState } from "@/lib/hooks";

export const useAddWallet = () => {
  const { open, onOpenChange } = usePopupState();

  const form = useForm<TWalletForm>({
    resolver: zodResolver(walletFormSchema),
    defaultValues: { name: "", initialBalance: 0, isSaving: false },
  });

  const handleAddWallet = form.handleSubmit((formData) => {
    console.log(formData);
  });

  return { form, handleAddWallet, states: { open, onOpenChange } };
};
