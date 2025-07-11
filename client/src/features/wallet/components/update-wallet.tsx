import { FC } from "react";
import { TUseUpdateWalletArgs, useUpdateWallet } from "../wallet-hooks";
import { Button } from "@/components/ui/button";
import { PencilLineIcon } from "lucide-react";
import { FormDialog } from "@/components/shared/form";
import { WalletForm } from "./wallet-form";

type UpdateWalletProps = TUseUpdateWalletArgs & { name: string; isSaving: boolean };
export const UpdateWallet: FC<UpdateWalletProps> = ({ name, isSaving, walletId, onSuccess }) => {
  const { open, onOpenChange, mutationKey, handleUpdateWallet } = useUpdateWallet({ walletId, onSuccess });

  return (
    <>
      <Button variant="ghost" className="w-full justify-start" onClick={() => onOpenChange(true)}>
        <PencilLineIcon className="size-4" /> Update Wallet
      </Button>

      <FormDialog
        open={open}
        onOpenChange={onOpenChange}
        formId={mutationKey}
        title="Update Wallet"
        description="Fill up the form to update a wallet"
      >
        <WalletForm formId={mutationKey} mode="edit" onSubmit={handleUpdateWallet} defaultValues={{ name, isSaving }} />
      </FormDialog>
    </>
  );
};
