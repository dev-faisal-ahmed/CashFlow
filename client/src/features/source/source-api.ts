import { api } from "@/lib/api";
import { apiUrl } from "@/lib/api-url";
import { TPromiseResponse, TSource } from "@/lib/types";

export const addSource = async (payload: TAddSourcePayload): TPromiseResponse => {
  const { data } = await api.post(apiUrl.source.add, payload);
  return data;
};

export const getSourceList = async ():TPromiseResponse => {
  const { data } = await api.get(apiUrl.source.getAll(""))
  return data
}

type TAddSourcePayload = Pick<TSource, "name" | "type" | "budget">;
