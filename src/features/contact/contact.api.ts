import { contactClient } from "@/lib/client";
import { ToString } from "@/lib/types";
import { CreateContactDto, GetContactsArgs, UpdateContactDto } from "@/server/modules/contact/contact.validation";
import { contactSchema } from "./contact.schema";

// Create Contact
export const createContactApi = async (payload: CreateContactDto) => {
  const res = await contactClient.index.$post({ json: payload });
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  return resData;
};

// Get Contacts
export const getContactsApi = async (args: ToString<GetContactsArgs>) => {
  const res = await contactClient.index.$get({ query: { ...args, fields: "_id,name,phone,address,given,taken" } });
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  const parsedData = await contactSchema.getContacts.parseAsync(resData.data);
  return { data: parsedData, meta: resData.meta };
};

// Update Contact
export const updateContactApi = async ({ id, ...dto }: UpdateContactDto & { id: string }) => {
  const res = await contactClient[":id"].$patch({ param: { id }, json: dto });
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  return resData;
};

// Delete Contact
export const deleteContactApi = async (contactId: string) => {
  const res = await contactClient[":id"].$delete({ param: { id: contactId } });
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  return resData;
};
