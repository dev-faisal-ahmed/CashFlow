import { sourceClient } from "@/lib/client";
import { CreateSourceDto, GetSourcesArgs, UpdateSourceDto } from "@/server/modules/source/source.validation";
import { sourceSchema } from "./source.schema";
import { ToString } from "@/lib/types";

// Add
export const addSourceApi = async (payload: CreateSourceDto) => {
  const res = await sourceClient.index.$post({ json: payload });
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  return resData;
};

// Get
export const getSourceListApi = async (args: ToString<GetSourcesArgs>) => {
  const res = await sourceClient.index.$get({ query: { fields: "_id,name,type,budget,income,expense", getAll: "true", ...args } });
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  const validatedData = await sourceSchema.sourceListData.parseAsync(resData.data);
  return validatedData;
};

export const getSourceListWithBasicInfoApi = async () => {
  const res = await sourceClient.index.$get({ query: { fields: "_id,name", getAll: "true" } });
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  const validatedData = await sourceSchema.sourceListWihBasicData.parseAsync(resData.data);
  return validatedData;
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
