import { api } from "@/lib/api";
import { apiUrl } from "@/lib/api-url";
import { TPromiseResponse, TSource } from "@/lib/types";
import { buildQueryString } from "@/lib/utils";

export const addSource = async (payload: TAddSourcePayload): TPromiseResponse => {
  const { data } = await api.post(apiUrl.source.add, payload);
  return data;
};

export const getSourceList = async (): TPromiseResponse<TGetSourceListResponse> => {
  const queryString = buildQueryString({ fields: "_id,name,budget,type,income,expense" });
  const url = apiUrl.source.getAll(queryString);
  const { data } = await api.get(url);
  return data;
};

export const updateSourceList = async (sourceId: string, payload: TAddSourcePayload): TPromiseResponse => {
  const { data } = await api.patch(apiUrl.source.updateOne(sourceId), payload);
  return data;
};

type TAddSourcePayload = Pick<TSource, "name" | "type" | "budget">;
type TGetSourceListResponse = Array<Pick<TSource, "_id" | "name" | "type" | "budget"> & { income: number; expense: number }>;
