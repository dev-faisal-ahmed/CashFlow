"use client";

import { ErrorMessage } from "@/components/shared";
import { FC, PropsWithChildren } from "react";
import { useSearch } from "@/lib/hooks";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query.keys";
import { getAllCategoriesApi } from "../category.api";
import { CategoryListSkeleton } from "./category-loading";
import { CategoryCard } from "./category-card";
import { SearchInput } from "@/components/shared/form";

export const AllCategories = () => {
  const { value, onSearchChange } = useSearch();

  const {
    data: categories,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [queryKeys.category],
    queryFn: () => getAllCategoriesApi(),
  });

  if (isLoading) return <LoadingSkeleton />;
  if (isError) throw error;
  if (!categories?.length) return <ErrorMessage message="No Category Found" className="my-12" />;

  const filteredCategories = value
    ? categories.filter((category) => category.name.toLowerCase().includes(value.toLowerCase()))
    : categories;

  return (
    <>
      <SearchInput className="mx-auto mb-6 w-full" value={value} onChange={onSearchChange} placeholder="Search Category" />

      {filteredCategories?.length ? (
        <Grid>
          {filteredCategories.map((category) => (
            <CategoryCard key={category.id} {...category} />
          ))}
        </Grid>
      ) : (
        <ErrorMessage message="No Category Found" className="my-12" />
      )}
    </>
  );
};

const Grid: FC<PropsWithChildren> = ({ children }) => <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{children}</section>;

const LoadingSkeleton = () => (
  <Grid>
    <CategoryListSkeleton size={6} />
  </Grid>
);
