"use client";

import { queryKeys } from "@/lib/query.keys";
import { useQuery } from "@tanstack/react-query";
import { SourceCard } from "./source-card";
import { ErrorMessage } from "@/components/shared";
import { sourceClient } from "@/lib/client";
import { sourceSchema } from "../source-schema";
import { SourceListSkeleton } from "./source-loading";
import { FC, PropsWithChildren } from "react";

export const SourceList = () => {
  const { data: sourceList, isLoading } = useQuery({ queryKey: [queryKeys.source], queryFn: getSourceListApi });

  if (isLoading) return <LoadingSkeleton />;
  if (!sourceList?.length) return <ErrorMessage message="No Source Found" className="my-12" />;

  return (
    <Grid>
      {sourceList.map((source) => (
        <SourceCard key={source._id} {...source} />
      ))}
    </Grid>
  );
};

const Grid: FC<PropsWithChildren> = ({ children }) => <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</section>;

const LoadingSkeleton = () => (
  <Grid>
    <SourceListSkeleton size={6} />
  </Grid>
);
// Api
const getSourceListApi = async () => {
  const res = await sourceClient.index.$get({ query: { fields: "_id,name,type,budget,income,expense", getAll: "true" } });
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  console.log(resData.data);
  const validatedData = await sourceSchema.sourceListData.parseAsync(resData.data);
  return validatedData;
};
