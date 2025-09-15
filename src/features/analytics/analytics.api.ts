import { analyticsClient } from "@/lib/client";

export const getFinancialOverviewApi = async () => {
  const res = await analyticsClient.overview.$get();
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  return resData;
};
