import { useFormContext } from "react-hook-form";
import { TWalletForm } from "../wallet-type";
import { Input } from "@/components/ui/input";
import { FieldForm } from "@/components/shared/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export const WalletFormFields = () => {
  const { control } = useFormContext<TWalletForm>();

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
