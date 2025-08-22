"use client";

import { FormDialog } from "@/components/shared/form";
import { Button } from "@/components/ui/button";
import { usePopupState } from "@/lib/hooks";
import { queryKeys } from "@/lib/query.keys";
import { PlusIcon } from "lucide-react";
import { TransactionForm } from "./transaction-form";
import { TRegularTransactionFormData } from "../transaction.schema";
import { ETransactionNature } from "@/server/modules/transaction/transaction.interface";

const mutationKey = `add-${queryKeys.transaction}`;

export const AddTransaction = () => {
  const { open, onOpenChange } = usePopupState();

  const handleAddTransaction = (formData: TRegularTransactionFormData, onReset: () => void) => {
    console.log(formData);
    console.log(onReset);
  };

  return (
    <>
      <Button onClick={() => onOpenChange(true)}>
        <PlusIcon className="size-4" /> Add Transaction
      </Button>

      <FormDialog
        open={open}
        onOpenChange={onOpenChange}
        formId={mutationKey}
        title="Add New Transaction"
        description="Fill up the form to create a new transaction"
      >
        <TransactionForm
          onSubmit={handleAddTransaction}
          defaultValues={{ date: new Date(), sourceId: "", walletId: "", nature: ETransactionNature.income }}
        />
      </FormDialog>
    </>
  );
};
