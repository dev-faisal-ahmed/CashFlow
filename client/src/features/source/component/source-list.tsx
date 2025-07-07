"use client";

import { QK } from "@/lib/query-keys";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getSourceList } from "../source-api";
import { SourceCard } from "./source-card";
import { ErrorMessage } from "@/components/shared";

export const SourceList = () => {
  const { data: sourceList } = useSuspenseQuery({ queryKey: [QK.SOURCE, "LIST"], queryFn: getSourceList, select: (res) => res.data });
  if (!sourceList.length) return <ErrorMessage message="No Source Found" className="my-12" />;

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {sourceList.map((source) => (
        <SourceCard key={source._id} {...source} />
      ))}
    </section>
  );
};
