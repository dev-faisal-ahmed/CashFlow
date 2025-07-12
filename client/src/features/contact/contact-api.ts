import { api } from "@/lib/api";
import { apiUrl } from "@/lib/api-url";
import { TContact, TPromiseResponse } from "@/lib/types";

export const addContact = async (payload: TAddContactPayload): TPromiseResponse => {
  const { data } = await api.post(apiUrl.contact.add, payload);
  return data;
};

export type TAddContactPayload = Pick<TContact, "name" | "phone" | "address">;
