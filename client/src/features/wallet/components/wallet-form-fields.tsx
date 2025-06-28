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
    </>
  );
};
