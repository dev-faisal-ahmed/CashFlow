"use client";

import { FormDialog } from "@/components/shared/form/form-dialog";
import { Button } from "@/components/ui/button";
import { QK } from "@/lib/query-keys";
import { PlusIcon } from "lucide-react";
import { useAddWallet } from "../wallet-hooks";
import { Form } from "@/components/ui/form";
import { WalletFormFields } from "./wallet-form-fields";

const formId = `ADD_${QK.WALLET}`;
export const AddWallet = () => {
  const {
    form,
    handleAddWallet,
    states: { open, onOpenChange },
  } = useAddWallet();

  return (
    <>
      <Button onClick={() => onOpenChange(true)}>
        <PlusIcon className="size-4" /> Add Wallet
      </Button>

      <FormDialog
        open={open}
        onOpenChange={onOpenChange}
        formId={formId}
        title="Add New Wallet"
        description="Fill up the form to create a wallet"
      >
        <Form {...form}>
          <form id={formId} onSubmit={handleAddWallet} className="mt-2 flex flex-col gap-4">
            <WalletFormFields />
          </form>
        </Form>
      </FormDialog>
    </>
  );
};
