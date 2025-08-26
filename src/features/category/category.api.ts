import { categoryClient } from "@/lib/client";
import { CreateCategoryDto } from "@/server/modules/category/category.validation";

export const addCategoryApi = async (dto: CreateCategoryDto) => {
  const res = await categoryClient.index.$post({ json: dto });
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  return resData;
};
