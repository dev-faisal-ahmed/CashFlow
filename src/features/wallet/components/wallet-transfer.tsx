"use client";

import { FC, Suspense } from "react";
import { CommonSelect, FieldForm, FormDialog } from "@/components/shared/form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { SendHorizontalIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { queryKeys } from "@/lib/query.keys";
import { TWalletTransferFormData } from "../wallet.schema";
import { useGetWalletsForTransfer, useTransferWallet, useTransferWalletForm } from "../wallet.hook";

type WalletTransferProps = { balance: number; walletId: string; onSuccess: () => void };

export const WalletTransfer: FC<WalletTransferProps> = ({ walletId, onSuccess }) => {
  const mutationKey = `transfer-${queryKeys.wallet}-${walletId}`;
  const { open, onOpenChange, handleTransferWallet } = useTransferWallet({ mutationKey, walletId, onSuccess });

  return (
    <>
      <Button variant="ghost" className="w-full justify-start" onClick={() => onOpenChange(true)}>
        <SendHorizontalIcon /> Transfer
      </Button>

      <FormDialog
        open={open}
        onOpenChange={onOpenChange}
        formId={mutationKey}
        title="Transfer Money"
        description="Provide necessary information to transfer money"
      >
        <TransferWalletForm formId={mutationKey} sourceWalletId={walletId} onSubmit={handleTransferWallet} />
      </FormDialog>
    </>
  );
};

type TransferWalletFormProps = {
  formId: string;
  sourceWalletId: string;
  onSubmit: (formData: TWalletTransferFormData, onReset: () => void) => void;
};

const TransferWalletForm: FC<TransferWalletFormProps> = ({ formId, onSubmit, sourceWalletId }) => {
  const { form, handleSubmit } = useTransferWalletForm({ sourceWalletId, onSubmit });

  return (
    <Form {...form}>
      <form id={formId} onSubmit={handleSubmit} className="mt-2 flex flex-col gap-4">
        <FieldForm control={form.control} name="amount" label="Amount">
          {({ field: { value, onChange } }) => (
            <Input placeholder="@: 100" value={value || ""} onChange={(e) => onChange(Number(e.target.value))} />
          )}
        </FieldForm>

        <Suspense fallback={<WalletSelectionSKeleton />}>
          <FieldForm control={form.control} name="destinationWalletId" label="Destination Wallet">
            {({ field: { value, onChange } }) => (
              <DestinationWalletSelection sourceWalletId={sourceWalletId} value={value} onChange={onChange} />
            )}
          </FieldForm>
        </Suspense>

        <FieldForm control={form.control} name="description" label="Description">
          {({ field }) => <Textarea {...field} placeholder="@: Description" />}
        </FieldForm>
      </form>
    </Form>
  );
};

type DestinationWalletSelectionProps = { sourceWalletId: string; value: string; onChange: (value: string) => void };

const DestinationWalletSelection: FC<DestinationWalletSelectionProps> = ({ sourceWalletId, value, onChange }) => {
  const { data: walletList } = useGetWalletsForTransfer(sourceWalletId);

  return <CommonSelect value={value} onChange={onChange} options={walletList ?? []} placeholder="Select destination wallet" />;
};

const WalletSelectionSKeleton = () => <Skeleton className="h-input" />;
