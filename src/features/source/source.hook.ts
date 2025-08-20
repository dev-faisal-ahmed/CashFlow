import { useForm } from "react-hook-form";
import { sourceSchema, TSourceFormData } from "./source.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usePopupState, useSearch } from "@/lib/hooks";
import { addSourceApi, deleteSourceApi, getSourceListApi, updateSourceApi } from "./source.api";
import { queryKeys } from "@/lib/query.keys";

// Form
type TUseSourceForm = {
  defaultValues: TSourceFormData;
  onSubmit: (formData: TSourceFormData, onReset: () => void) => void;
};

export const useSourceForm = ({ defaultValues, onSubmit }: TUseSourceForm) => {
  const form = useForm<TSourceFormData>({ resolver: zodResolver(sourceSchema.source), defaultValues });
  const handleSubmit = form.handleSubmit((formData) => onSubmit(formData, form.reset));
  return { form, handleSubmit };
};

// Add
export const useAddSource = (mutationKey: string) => {
  const queryClient = useQueryClient();
  const { open, onOpenChange } = usePopupState();
  const { mutate } = useMutation({ mutationKey: [mutationKey], mutationFn: addSourceApi });

  const handleAddSource = (formData: TSourceFormData, onReset: () => void) => {
    mutate(
      { name: formData.name, type: formData.type, ...(formData.addBudget && { budget: formData.budget }) },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [queryKeys.source] });
          onReset();
          onOpenChange(false);
        },
      },
    );
  };

  return { open, onOpenChange, handleAddSource };
};

// Get
export const useGetSources = () => {
  const { value, onSearchChange } = useSearch();
  const query = useQuery({ queryKey: [queryKeys.source, value], queryFn: () => getSourceListApi({ search: value }) });
  return { value, onSearchChange, ...query };
};

// Update
type TUseUpdateSource = {
  id: string;
  mutationKey: string;
  onSuccess: () => void;
};
export const useUpdateSource = ({ id, mutationKey, onSuccess }: TUseUpdateSource) => {
  const queryClient = useQueryClient();

  const { open, onOpenChange } = usePopupState();
  const { mutate } = useMutation({ mutationKey: [mutationKey], mutationFn: updateSourceApi });

  const handleUpdateSource = async (formData: TSourceFormData, onReset: () => void) => {
    mutate(
      { id, ...formData },
      {
        onSuccess: () => {
          onReset();
          queryClient.invalidateQueries({ queryKey: [queryKeys.source] });
          onOpenChange(false);
          onSuccess();
        },
      },
    );
  };

  return { open, onOpenChange, handleUpdateSource };
};

// Delete
type TUseDeleteSource = {
  mutationKey: string;
  id: string;
};

export const useDeleteSource = ({ mutationKey, id }: TUseDeleteSource) => {
  const queryClient = useQueryClient();

  const { open, onOpenChange } = usePopupState();
  const { mutate } = useMutation({ mutationKey: [mutationKey], mutationFn: deleteSourceApi });

  const handleDelete = () => {
    mutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [queryKeys.source] });
        onOpenChange(false);
      },
    });
  };

  return { open, onOpenChange, handleDelete };
};
