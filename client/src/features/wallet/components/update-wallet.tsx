import { FC } from "react";
import { TUseUpdateWalletArgs, useUpdateWallet } from "../wallet-hooks";
import { Button } from "@/components/ui/button";
import { PencilLineIcon } from "lucide-react";
import { FormDialog } from "@/components/shared/form";
import { Form } from "@/components/ui/form";
import { WalletFormFields } from "./wallet-form-fields";

type UpdateWalletProps = TUseUpdateWalletArgs;
export const UpdateWallet: FC<UpdateWalletProps> = ({ walletId, name, isSaving, onSuccess }) => {
  const {
    form,
    handleUpdateWallet,
    popup: { open, onOpenChange },
    mutationKey,
  } = useUpdateWallet({ walletId, name, isSaving, onSuccess });

  return (
    <>
      <Button variant="ghost" className="w-full justify-start" onClick={() => onOpenChange(true)}>
        <PencilLineIcon className="size-4" /> Update Wallet
      </Button>

      <FormDialog
        open={open}
        onOpenChange={onOpenChange}
        formId={mutationKey}
        title="Add New Wallet"
        description="Fill up the form to create a wallet"
      >
        <Form {...form}>
          <form id={mutationKey} onSubmit={handleUpdateWallet} className="mt-2 flex flex-col gap-4">
            <WalletFormFields mode="edit" />
          </form>
        </Form>
      </FormDialog>
    </>
  );
};
