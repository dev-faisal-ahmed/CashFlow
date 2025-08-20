"use client";

import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { DeleteDialog } from "@/components/shared";
import { queryKeys } from "@/lib/query.keys";
import { useDeleteWallet } from "../wallet.hook";

type DeleteWalletProps = { walletId: string };

export const DeleteWallet: FC<DeleteWalletProps> = ({ walletId }) => {
  const mutationKey = `delete-${queryKeys.wallet}-${walletId}`;
  const { open, onOpenChange, handleDeleteWallet } = useDeleteWallet({ mutationKey, id: walletId });

  return (
    <>
      <Button variant="destructive_ghost" className="w-full justify-start" onClick={() => onOpenChange(true)}>
        <Trash2Icon /> Delete Wallet
      </Button>

      <DeleteDialog open={open} onOpenChange={onOpenChange} mutationKey={mutationKey} onDelete={handleDeleteWallet} />
    </>
  );
};
