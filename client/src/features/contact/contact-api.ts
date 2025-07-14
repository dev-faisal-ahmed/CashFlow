import { api } from "@/lib/api";
import { apiUrl } from "@/lib/api-url";
import { TContact, TPromiseResponse, TQuery } from "@/lib/types";
import { buildQueryString } from "@/lib/utils";

export const addContact = async (payload: TAddContactPayload): TPromiseResponse => {
  const { data } = await api.post(apiUrl.contact.add, payload);
  return data;
};

export const getAllContacts = async (query: TQuery): TPromiseResponse<TGetAllContactsResponse> => {
  const queryString = buildQueryString({ ...query, fields: "_id,name,phone,address,given,taken" });
  const url = apiUrl.contact.getAll(queryString);
  const { data } = await api.get(url);
  return data;
};

type TAddContactPayload = Pick<TContact, "name" | "phone" | "address">;
export type TGetAllContactsResponse = Array<Pick<TContact, "_id" | "name" | "phone" | "address"> & { given: number; taken: number }>;
