import { FC, Suspense } from "react";
import { QK } from "@/lib/query-keys";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CommonSelect, FieldForm, FormDialog } from "@/components/shared/form";
import { TWalletTransferForm } from "../wallet-type";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { SendHorizontalIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getWalletListForTransfer } from "../wallet-api";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { walletTransferFormSchema } from "../wallet-schema";
import { useWalletTransfer } from "../wallet-hooks";

type WalletTransferProps = { balance: number; walletId: string; onSuccess: () => void };
export const WalletTransfer: FC<WalletTransferProps> = ({ balance, walletId, onSuccess }) => {
  const { open, onOpenChange, handleTransferWallet, FORM_ID } = useWalletTransfer(walletId, balance, onSuccess);

  return (
    <>
      <Button variant="ghost" className="w-full justify-start" onClick={() => onOpenChange(true)}>
        <SendHorizontalIcon /> Transfer
      </Button>

      <FormDialog
        open={open}
        onOpenChange={onOpenChange}
        formId={FORM_ID}
        title="Transfer Money"
        description="Provide necessary information to transfer money"
      >
        <TransferWalletForm formId={FORM_ID} sourceWalletId={walletId} onSubmit={handleTransferWallet} />
      </FormDialog>
    </>
  );
};

type TransferWalletFormProps = {
  formId: string;
  sourceWalletId: string;
  onSubmit: (formData: TWalletTransferForm, reset: () => void) => void;
};

const TransferWalletForm: FC<TransferWalletFormProps> = ({ formId, onSubmit, sourceWalletId }) => {
  const form = useForm<TWalletTransferForm>({
    resolver: zodResolver(walletTransferFormSchema),
    defaultValues: { description: "", destinationWalletId: "", sourceWalletId },
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
  const { data: walletList } = useSuspenseQuery({
    queryKey: [QK.WALLET, "FOR_TRANSFER"],
    queryFn: getWalletListForTransfer,
    select: (res) =>
      res.data.map((wallet) => ({ value: wallet._id, label: wallet.name })).filter((wallet) => wallet.value !== sourceWalletId),
  });

  return <CommonSelect value={value} onChange={onChange} options={walletList} placeholder="Select destination wallet" />;
};

const WalletSelectionSKeleton = () => <Skeleton className="h-input" />;
