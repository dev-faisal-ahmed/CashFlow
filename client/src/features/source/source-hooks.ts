import { usePopupState } from "@/lib/hooks";
import { QK } from "@/lib/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TSourceForm } from "./source-type";
import { addSource, updateSource } from "./source-api";
import { TBudget, TSourceType } from "@/lib/types";

// Add Source
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

// Update Source
type TUseUpdateSourceArgs = { sourceId: string; onSuccess: () => void };
export const useUpdateSource = ({ sourceId, onSuccess }: TUseUpdateSourceArgs) => {
  const mutationKey = `UPDATE_${QK.SOURCE}_${sourceId}`;
  const qc = useQueryClient();

  const { open, onOpenChange } = usePopupState();
  const { mutate } = useMutation({ mutationKey: [mutationKey], mutationFn: updateSource });

  const handleUpdateSource = (formData: TSourceForm, onReset: () => void) => {
    const { name, type, addBudget, budget } = formData;
    const payload = { _id: sourceId, name, ...(type === "EXPENSE" && { addBudget, budget: budget as TBudget }) };

    mutate(payload, {
      onSuccess: () => {
        onReset();
        qc.invalidateQueries({ queryKey: [QK.SOURCE] });
        onOpenChange(false);
        onSuccess();
      },
    });
  };

  return { handleUpdateSource, open, onOpenChange, mutationKey };
};
