"use client";

import { ErrorMessage } from "@/components/shared";
import { FC, PropsWithChildren } from "react";
import { useSearch } from "@/lib/hooks";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query.keys";
import { getCategoryListApi } from "../category.api";
import { CategoryListSkeleton } from "./category-loading";
import { CategoryCard } from "./category-card";

export const CategoryList = () => {
  const { value } = useSearch();

  const {
    data: categories,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [queryKeys.category, { search: value }],
    queryFn: () => getCategoryListApi({ search: value }),
  });

  if (isLoading) return <LoadingSkeleton />;
  if (isError) throw error;
  if (!categories?.length) return <ErrorMessage message="No Category Found" className="my-12" />;

  return (
    <Grid>
      {categories.map((category) => (
        <CategoryCard key={category.id} {...category} />
      ))}
    </Grid>
  );
};

const Grid: FC<PropsWithChildren> = ({ children }) => <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</section>;

const LoadingSkeleton = () => (
  <Grid>
    <CategoryListSkeleton size={6} />
  </Grid>
);
