"use client";

import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { DeleteDialog } from "@/components/shared";
import { queryKeys } from "@/lib/query.keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePopupState } from "@/lib/hooks";
import { deleteWalletApi } from "../wallet.api";

type DeleteWalletProps = { walletId: string };

export const DeleteWallet: FC<DeleteWalletProps> = ({ walletId }) => {
  const mutationKey = `delete-${queryKeys.wallet}-${walletId}`;
  const queryClient = useQueryClient();
  const { open, onOpenChange } = usePopupState();
  const { mutate } = useMutation({ mutationKey: [mutationKey], mutationFn: deleteWalletApi });

  const handleDeleteWallet = () => {
    mutate(walletId, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [queryKeys.wallet] });
        onOpenChange(false);
      },
    });
  };

  return (
    <>
      <Button variant="destructive_ghost" className="w-full justify-start" onClick={() => onOpenChange(true)}>
        <Trash2Icon /> Delete Wallet
      </Button>

      <DeleteDialog open={open} onOpenChange={onOpenChange} mutationKey={mutationKey} onDelete={handleDeleteWallet} />
    </>
  );
};
