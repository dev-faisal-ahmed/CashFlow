"use client";

import { FormDialog } from "@/components/shared/form/form-dialog";
import { Button } from "@/components/ui/button";
import { QK } from "@/lib/query-keys";
import { PlusIcon } from "lucide-react";
import { useAddWallet } from "../wallet-hooks";
import { Form } from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { TAddWalletForm } from "../wallet-type";
import { FieldForm } from "@/components/shared/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

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

const WalletFormFields = () => {
  const { control } = useFormContext<TAddWalletForm>();

  return (
    <>
      <FieldForm control={control} name="name" label="Wallet Name">
        {({ field }) => <Input {...field} placeholder="@: BKash" />}
      </FieldForm>

      <FieldForm control={control} name="initialBalance" label="Initial Balance">
        {({ field: { value, onChange } }) => (
          <Input value={value || ""} onChange={(e) => onChange(Number(e.target.value))} placeholder="@: 100" />
        )}
      </FieldForm>

      <FieldForm control={control} name="isSaving">
        {({ field: { value, onChange } }) => (
          <div className="flex items-center gap-2">
            <Checkbox id="isSaving" checked={!!value} onCheckedChange={onChange} className="cursor-pointer" />
            <Label htmlFor="isSaving" className="text-muted-foreground cursor-pointer">
              Saving Wallet?
            </Label>
          </div>
        )}
      </FieldForm>
    </>
  );
};
