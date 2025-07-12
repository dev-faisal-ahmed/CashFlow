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

export const updateSource = async ({ _id, ...payload }: TUpdateSourcePayload): TPromiseResponse => {
  const url = apiUrl.source.updateOne(_id);
  const { data } = await api.patch(url, payload);
  return data;
};

export const deleteSource = async (sourceId: string): TPromiseResponse => {
  const url = apiUrl.source.deleteOne(sourceId);
  const { data } = await api.delete(url);
  return data;
};

type TAddSourcePayload = Pick<TSource, "name" | "type" | "budget">;
type TGetSourceListResponse = Array<Pick<TSource, "_id" | "name" | "type" | "budget"> & { income: number; expense: number }>;
type TUpdateSourcePayload = Pick<TSource, "_id" | "name" | "budget">;
