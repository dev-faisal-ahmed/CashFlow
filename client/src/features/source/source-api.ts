import { api } from "@/lib/api";
import { apiUrl } from "@/lib/api-url";
import { TPromiseResponse, TSource } from "@/lib/types";

export const addSource = async (payload: TAddSourcePayload): TPromiseResponse => {
  const { data } = await api.post(apiUrl.source.add, payload);
  return data;
};

type TAddSourcePayload = Pick<TSource, "name" | "budget">;
