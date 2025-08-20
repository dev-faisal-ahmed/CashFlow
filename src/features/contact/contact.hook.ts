import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, TContactFormData } from "./contact.schema";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usePagination, usePopupState } from "@/lib/hooks";
import { queryKeys } from "@/lib/query.keys";
import { createContactApi, deleteContactApi, getContactsApi, updateContactApi } from "./contact.api";

// Contact Form
export const useContactForm = (defaultValues: TContactFormData, onSubmit: (formData: TContactFormData, onReset: () => void) => void) => {
  const form = useForm<TContactFormData>({ resolver: zodResolver(contactSchema.contact), defaultValues });
  const handleSubmit = form.handleSubmit((formData) => onSubmit(formData, form.reset));

  return { form, handleSubmit };
};

// Add Contact
export const useAddContact = (mutationKey: string) => {
  const queryClient = useQueryClient();

  const { open, onOpenChange } = usePopupState();
  const { mutate } = useMutation({ mutationKey: [mutationKey], mutationFn: createContactApi });

  const handleAddContact = (formData: TContactFormData, onReset: () => void) => {
    mutate(
      { ...formData, ...(formData.address && { address: formData.address }) },
      {
        onSuccess: () => {
          onReset();
          queryClient.invalidateQueries({ queryKey: [queryKeys.contact] });
          onOpenChange(false);
        },
      },
    );
  };

  return { open, onOpenChange, handleAddContact };
};

// Get Contacts
export const useGetContacts = () => {
  const { pagination, setPagination } = usePagination(10);
  const { data: apiResponse, isLoading } = useQuery({
    queryKey: [queryKeys.contact, { page: pagination.pageIndex + 1 }],
    queryFn: () => getContactsApi({ page: String(pagination.pageIndex + 1), limit: String(pagination.pageSize) }),
    select: (res) => ({ contacts: res.data, meta: res.meta }),
  });

  return { apiResponse, isLoading, pagination, setPagination };
};

// Update Contact
type TUseUpdateContact = {
  mutationKey: string;
  id: string;
};

export const useUpdateContact = ({ mutationKey, id }: TUseUpdateContact) => {
  const queryClient = useQueryClient();

  const { open, onOpenChange } = usePopupState();
  const { mutate } = useMutation({ mutationKey: [mutationKey], mutationFn: updateContactApi });

  const handleUpdateContact = (formData: TContactFormData, onReset: () => void) => {
    mutate(
      { id, name: formData.name, address: formData.address },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [queryKeys.contact] });
          onReset();
          onOpenChange(false);
        },
      },
    );
  };

  return { open, onOpenChange, handleUpdateContact };
};

// Delete Contact
type TUseDeleteContact = {
  mutationKey: string;
  id: string;
};

export const useDeleteContact = ({ mutationKey, id }: TUseDeleteContact) => {
  const queryClient = useQueryClient();

  const { open, onOpenChange } = usePopupState();
  const { mutate } = useMutation({ mutationKey: [mutationKey], mutationFn: deleteContactApi });

  const handleDeleteContact = () => {
    mutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [queryKeys.contact] });
        onOpenChange(false);
      },
    });
  };

  return { open, onOpenChange, handleDeleteContact };
};
