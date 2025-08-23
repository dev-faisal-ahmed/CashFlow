import { sourceClient } from "@/lib/client";
import { CreateSourceDto, GetSourcesArgs, UpdateSourceDto } from "@/server/modules/source/source.validation";
import { ToString } from "@/lib/types";
import { ISource } from "@/server/modules/source/source.interface";

// Add
export const addSourceApi = async (payload: CreateSourceDto) => {
  const res = await sourceClient.index.$post({ json: payload });
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  return resData;
};

// Get
type TSourceData = Pick<ISource, "name" | "type" | "budget"> & { _id: string; income: number; expense: number };
export const getSourceListApi = async (args: ToString<GetSourcesArgs>) => {
  const res = await sourceClient.index.$get({ query: { fields: "_id,name,type,budget,income,expense", getAll: "true", ...args } });
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  return resData.data as TSourceData[];
};

type TSourceListWithBasicInfo = Pick<ISource, "name"> & { _id: string };
export const getSourceListWithBasicInfoApi = async () => {
  const res = await sourceClient.index.$get({ query: { fields: "_id,name", getAll: "true" } });
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  return resData.data as TSourceListWithBasicInfo[];
};

// Update
export const updateSourceApi = async ({ id, ...dto }: UpdateSourceDto & { id: string }) => {
  const res = await sourceClient[":id"].$patch({ param: { id }, json: dto });
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  return resData;
};

// Delete
export const deleteSourceApi = async (sourceId: string) => {
  const res = await sourceClient[":id"].$delete({ param: { id: sourceId } });
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  return resData;
};
