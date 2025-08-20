import { usePopupState, useSearch } from "@/lib/hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TAddWalletFormData, TWalletFormData, TWalletTransferFormData } from "./wallet.schema";
import { addWalletApi, deleteWalletApi, getAllWalletListApi, getWalletListForTransferApi, transferWalletApi } from "./wallet.api";
import { queryKeys } from "@/lib/query.keys";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { walletSchema } from "./wallet.schema";

// Form
type TUseWalletForm = {
  mode: "add" | "update";
  defaultValues: TWalletFormData;
  onSubmit: (formData: TWalletFormData, onReset: () => void) => void;
};

export const useWalletForm = ({ mode, defaultValues, onSubmit }: TUseWalletForm) => {
  const schema = mode === "add" ? walletSchema.addWallet : walletSchema.updateWallet;
  const form = useForm<TWalletFormData>({ resolver: zodResolver(schema), defaultValues });
  const handleSubmit = form.handleSubmit((formData) => onSubmit(formData, form.reset));

  return { form, handleSubmit };
};

type TUseTransferWalletForm = {
  sourceWalletId: string;
  onSubmit: (formData: TWalletTransferFormData, onReset: () => void) => void;
};

export const useTransferWalletForm = ({ sourceWalletId, onSubmit }: TUseTransferWalletForm) => {
  const form = useForm<TWalletTransferFormData>({
    resolver: zodResolver(walletSchema.walletTransfer),
    defaultValues: { amount: 0, description: "", destinationWalletId: "", sourceWalletId },
  });

  const handleSubmit = form.handleSubmit((formData) => onSubmit(formData, form.reset));

  return { form, handleSubmit };
};

// Add
export const useAddWallet = (mutationKey: string) => {
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

  return { open, onOpenChange, handleAddWallet };
};

// Get
export const useGetWallet = () => {
  const { value, onSearchChange } = useSearch();

  const query = useQuery({
    queryKey: [queryKeys.wallet],
    queryFn: () => getAllWalletListApi({ search: value }),
  });

  return { value, onSearchChange, ...query };
};

// Delete
type TUseDeleteWallet = {
  mutationKey: string;
  id: string;
};

export const useDeleteWallet = ({ mutationKey, id }: TUseDeleteWallet) => {
  const queryClient = useQueryClient();
  const { open, onOpenChange } = usePopupState();
  const { mutate } = useMutation({ mutationKey: [mutationKey], mutationFn: deleteWalletApi });

  const handleDeleteWallet = () => {
    mutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [queryKeys.wallet] });
        onOpenChange(false);
      },
    });
  };

  return { open, onOpenChange, handleDeleteWallet };
};

// Get Wallet List For Transfer
export const useGetWalletsForTransfer = (sourceWalletId: string) => {
  return useQuery({
    queryKey: [queryKeys.wallet, "for-transaction"],
    queryFn: getWalletListForTransferApi,
    select: (res) => res.map((wallet) => ({ value: wallet._id, label: wallet.name })).filter((wallet) => wallet.value !== sourceWalletId),
  });
};

// Transfer Wallet
type TUseTransferWallet = {
  mutationKey: string;
  walletId: string;
  onSuccess: () => void;
};

export const useTransferWallet = ({ mutationKey, walletId, onSuccess }: TUseTransferWallet) => {
  const queryClient = useQueryClient();
  const { open, onOpenChange } = usePopupState();
  const { mutate } = useMutation({ mutationKey: [mutationKey], mutationFn: transferWalletApi });

  const handleTransferWallet = (formData: TWalletTransferFormData, onReset: () => void) => {
    mutate(
      {
        amount: formData.amount,
        senderWalletId: walletId,
        receiverWalletId: formData.destinationWalletId,
        ...(formData.description && { description: formData.description }),
      },
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

  return { open, onOpenChange, handleTransferWallet };
};
