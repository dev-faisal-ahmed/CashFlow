import { useForm } from "react-hook-form";
import { TRegularTransactionFormData } from "./transaction.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { transactionSchema } from "./transaction.schema";

// Form
type TUseRegularTransactionForm = {
  defaultValues: TRegularTransactionFormData;
  onSubmit: (formData: TRegularTransactionFormData, onReset: () => void) => void;
};

export const useRegularTransactionForm = ({ defaultValues, onSubmit }: TUseRegularTransactionForm) => {
  const form = useForm<TRegularTransactionFormData>({
    resolver: zodResolver(transactionSchema.regularTransaction),
    defaultValues,
  });

  const handleSubmit = form.handleSubmit((formData) => onSubmit(formData, form.reset));

  return { form, handleSubmit };
};

export const useCreateRegularTransaction = () => {};
