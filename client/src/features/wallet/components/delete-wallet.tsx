import { FC } from "react";
import { useDeleteWallet } from "../wallet-hooks";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { DeleteDialog } from "@/components/shared";

export const DeleteWallet: FC<{ walletId: string }> = ({ walletId }) => {
  const { open, onOpenChange, handleDeleteWallet, mutationKey } = useDeleteWallet(walletId);

  return (
    <>
      <Button variant="destructive_ghost" className="w-full justify-start" onClick={() => onOpenChange(true)}>
        <Trash2Icon /> Delete Wallet
      </Button>

      <DeleteDialog open={open} onOpenChange={onOpenChange} mutationKey={mutationKey} onDelete={handleDeleteWallet} />
    </>
  );
};
