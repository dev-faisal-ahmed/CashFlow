import { useFormContext } from "react-hook-form";
import { TWalletForm } from "../wallet-type";
import { Input } from "@/components/ui/input";
import { FieldForm } from "@/components/shared/form/field-form";

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
    </>
  );
};
