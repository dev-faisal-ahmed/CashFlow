"use client";

import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { DeleteDialog } from "@/components/shared";
import { usePopupState } from "@/lib/hooks";
import { walletClient } from "@/lib/client";
import { queryKeys } from "@/lib/query.keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type DeleteWalletProps = { walletId: string };
const mutationKey = `delete-${queryKeys.wallet}`;

export const DeleteWallet: FC<DeleteWalletProps> = ({ walletId }) => {
  const { open, onOpenChange } = usePopupState();
  const { mutate } = useMutation({ mutationKey: [mutationKey], mutationFn: deleteWalletApi });
  const queryClient = useQueryClient();

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

const deleteWalletApi = async (walletId: string) => {
  const res = await walletClient[":id"].$delete({ param: { id: walletId } });
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  return resData;
};
