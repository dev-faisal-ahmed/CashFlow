import { FC } from "react";
import { useDeleteWallet } from "../wallet-hooks";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { DeleteDialog } from "@/components/shared/delete-dialog";

export const DeleteWallet: FC<{ walletId: string }> = ({ walletId }) => {
  const { open, onOpenChange, handleDeleteWallet, mutationKey } = useDeleteWallet(walletId);

  return (
    <>
      <Button
        variant="ghost"
        className="text-destructive hover:bg-destructive/20 hover:text-destructive w-full justify-start"
        onClick={() => onOpenChange(true)}
      >
        <Trash2Icon /> Delete Wallet
      </Button>

      <DeleteDialog open={open} onOpenChange={onOpenChange} mutationKey={mutationKey} onDelete={handleDeleteWallet} />
    </>
  );
};
