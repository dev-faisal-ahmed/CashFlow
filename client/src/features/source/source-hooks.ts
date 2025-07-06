import { usePopupState } from "@/lib/hooks";
import { QK } from "@/lib/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { TSourceForm } from "./source-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { sourceSchema } from "./source-schema";
import { addSource } from "./source-api";
import { TSourceType } from "@/lib/types";

export const useAddSource = () => {
  const mutationKey = `ADD_${QK.SOURCE}`;
  const qc = useQueryClient();
  const { open, onOpenChange } = usePopupState();

  const form = useForm<TSourceForm>({ resolver: zodResolver(sourceSchema), defaultValues: { name: "", addBudget: false } });
  const { mutate } = useMutation({ mutationKey: [mutationKey], mutationFn: addSource });

  const handleAddSource = form.handleSubmit((formData) => {
    const { name, type, addBudget, budget } = formData;
    const payload = { name, type: type as TSourceType, ...(type === "EXPENSE" && addBudget && budget) };

    mutate(payload, {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: [QK.SOURCE] });
        onOpenChange(false);
        form.reset();
      },
    });
  });

  return { form, handleAddSource, open, onOpenChange, mutationKey };
};
