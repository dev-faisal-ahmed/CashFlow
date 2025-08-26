import { categoryClient } from "@/lib/client";
import { ToString } from "@/lib/types";
import { CreateCategoryDto, GetCategoriesArgs, UpdateCategoryDto } from "@/server/modules/category/category.validation";

export const addCategoryApi = async (dto: CreateCategoryDto) => {
  const res = await categoryClient.index.$post({ json: dto });
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  return resData;
};

export const getCategoryListApi = async (args: ToString<GetCategoriesArgs>) => {
  const res = await categoryClient.index.$get({ query: { ...args } });
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  return resData.data;
};

export const updateCategoryApi = async ({ id, ...dto }: UpdateCategoryDto & { id: string }) => {
  const res = await categoryClient[":id"].$patch({ param: { id }, json: dto });
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  return resData;
};

export const deleteCategoryApi = async (id: string) => {
  const res = await categoryClient[":id"].$delete({ param: { id } });
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  return resData;
};
