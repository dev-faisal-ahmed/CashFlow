import { FC } from "react";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldForm } from "@/components/shared/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { TAddWalletFormData, TUpdateWalletFormData, walletSchema } from "../wallet-schema";

export type TWalletFormData = TAddWalletFormData | TUpdateWalletFormData;

type WalletFormProps = {
  formId: string;
  mode: "add" | "update";
  defaultValues: TWalletFormData;
  onSubmit: (formData: TWalletFormData, onReset: () => void) => void;
};

export const WalletForm: FC<WalletFormProps> = ({ formId, mode, defaultValues, onSubmit }) => {
  const schema = mode === "add" ? walletSchema.addWallet : walletSchema.updateWallet;
  const form = useForm<TWalletFormData>({ resolver: zodResolver(schema), defaultValues });
  const handleSubmit = form.handleSubmit((formData) => onSubmit(formData, form.reset));

  return (
    <Form {...form}>
      <form id={formId} onSubmit={handleSubmit} className="space-y-4">
        <FieldForm control={form.control} name="name" label="Wallet Name">
          {({ field }) => <Input {...field} placeholder="@: BKash" />}
        </FieldForm>

        {mode === "add" && (
          <FieldForm control={form.control} name="initialBalance" label="Initial Balance">
            {({ field: { value, onChange } }) => (
              <Input value={value || ""} onChange={(e) => onChange(Number(e.target.value))} placeholder="@: 100" />
            )}
          </FieldForm>
        )}

        <FieldForm control={form.control} name="isSaving">
          {({ field: { value, onChange } }) => (
            <div className="flex items-center gap-2">
              <Checkbox id="isSaving" checked={!!value} onCheckedChange={onChange} className="cursor-pointer" />
              <Label htmlFor="isSaving" className="text-muted-foreground cursor-pointer">
                Saving Wallet?
              </Label>
            </div>
          )}
        </FieldForm>
      </form>
    </Form>
  );
};
