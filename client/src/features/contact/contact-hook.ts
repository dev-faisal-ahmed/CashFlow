import { TContactForm } from "./contact-type";
import { addContact, getAllContacts } from "./contact-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usePopupState } from "@/lib/hooks";
import { QK } from "@/lib/query-keys";

// Add Contact
export const useAddContact = () => {
  const mutationKey = `ADD_${QK.CONTACT}`;
  const qc = useQueryClient();

  const { open, onOpenChange } = usePopupState();
  const { mutate } = useMutation({
    mutationKey: [mutationKey],
    mutationFn: addContact,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QK.CONTACT] });
      onOpenChange(false);
    },
  });

  const handleAddContact = (formData: TContactForm, onReset: () => void) => {
    const payload = { ...formData, ...(formData.address && { address: formData.address }) };

    mutate(payload, {
      onSuccess: () => {
        onReset();
      },
    });
  };

  return { handleAddContact, open, onOpenChange, mutationKey };
};

// Get All Contacts
export const useGetAllContacts = (page: number, limit: number) => {
  return useQuery({
    queryKey: [QK.CONTACT, { page, limit }],
    queryFn: () => getAllContacts({ page: page.toString(), limit: limit.toString() }),
    select: (res) => ({ contacts: res.data, meta: res.meta }),
  });
};
