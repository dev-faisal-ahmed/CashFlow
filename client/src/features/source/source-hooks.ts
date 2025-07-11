import { usePopupState } from "@/lib/hooks";
import { QK } from "@/lib/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TSourceForm } from "./source-type";
import { addSource } from "./source-api";
import { TBudget, TSourceType } from "@/lib/types";

export const useAddSource = () => {
  const mutationKey = `ADD_${QK.SOURCE}`;
  const qc = useQueryClient();

  const { open, onOpenChange } = usePopupState();
  const { mutate } = useMutation({ mutationKey: [mutationKey], mutationFn: addSource });

  const handleAddSource = (formData: TSourceForm, onReset: () => void) => {
    const { name, type, addBudget, budget } = formData;
    const payload = { name, type: type as TSourceType, ...(type === "EXPENSE" && addBudget && { budget: budget as TBudget }) };

    mutate(payload, {
      onSuccess: () => {
        onReset();
        qc.invalidateQueries({ queryKey: [QK.SOURCE] });
        onOpenChange(false);
      },
    });
  };

  return { handleAddSource, open, onOpenChange, mutationKey };
};
