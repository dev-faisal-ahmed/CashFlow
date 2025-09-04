"use client";

import { FC, Suspense } from "react";
import { FieldForm, FormDialog } from "@/components/shared/form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { SendHorizontalIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { queryKeys } from "@/lib/query.keys";
import { TWalletTransferFormData, walletSchema } from "../wallet.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePopupState } from "@/lib/hooks";
import { transferWalletApi } from "../wallet.api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { WalletSelection } from "./wallet-selection";

type WalletTransferProps = { balance: number; walletId: number; onSuccess: () => void };

export const WalletTransfer: FC<WalletTransferProps> = ({ walletId, onSuccess }) => {
  const mutationKey = `transfer-${queryKeys.wallet}-${walletId}`;
  const queryClient = useQueryClient();
  const { open, onOpenChange } = usePopupState();
  const { mutate } = useMutation({ mutationKey: [mutationKey], mutationFn: transferWalletApi });

  const handleTransferWallet = (formData: TWalletTransferFormData, onReset: () => void) => {
    mutate(
      {
        amount: formData.amount,
        senderWalletId: walletId,
        receiverWalletId: formData.destinationWalletId,
        ...(formData.description && { description: formData.description }),
      },
      {
        onSuccess: () => {
          onReset();
          queryClient.invalidateQueries({ queryKey: [queryKeys.wallet] });
          onOpenChange(false);
          onSuccess();
        },
      },
    );
  };

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
        <TransferWalletForm formId={mutationKey} sourceWalletId={String(walletId)} onSubmit={handleTransferWallet} />
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
  const form = useForm<TWalletTransferFormData>({
    resolver: zodResolver(walletSchema.walletTransfer),
    defaultValues: { amount: 0, description: "" },
  });

  const handleSubmit = form.handleSubmit((formData) => onSubmit(formData, form.reset));

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
              <WalletSelection skipWalletId={sourceWalletId} value={value} onChange={onChange} placeholder="Select destination wallet" />
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

const WalletSelectionSKeleton = () => <Skeleton className="h-input" />;
