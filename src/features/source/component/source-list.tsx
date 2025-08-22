"use client";

import { SourceCard } from "./source-card";
import { ErrorMessage } from "@/components/shared";
import { SourceListSkeleton } from "./source-loading";
import { FC, PropsWithChildren } from "react";
import { useSearch } from "@/lib/hooks";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query.keys";
import { getSourceListApi } from "../source.api";

export const SourceList = () => {
  const { value } = useSearch();

  const {
    data: sourceList,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [queryKeys.source, value],
    queryFn: () => getSourceListApi({ search: value }),
  });

  if (isLoading) return <LoadingSkeleton />;
  if (isError) throw error;
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
