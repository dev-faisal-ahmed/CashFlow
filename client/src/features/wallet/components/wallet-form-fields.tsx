import { useFormContext } from "react-hook-form";
import { TWalletForm } from "../wallet-type";
import { FieldForm } from "@/components/shared/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FC } from "react";

export const WalletFormFields: FC<{ mode: "add" | "edit" }> = ({ mode }) => {
  const { control } = useFormContext<TWalletForm>();

  return (
    <>
      <FieldForm control={control} name="name" label="Wallet Name">
        {({ field }) => <Input {...field} placeholder="@: BKash" />}
      </FieldForm>

      {mode === "add" && (
        <FieldForm control={control} name="initialBalance" label="Initial Balance">
          {({ field: { value, onChange } }) => (
            <Input value={value || ""} onChange={(e) => onChange(Number(e.target.value))} placeholder="@: 100" />
          )}
        </FieldForm>
      )}

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
