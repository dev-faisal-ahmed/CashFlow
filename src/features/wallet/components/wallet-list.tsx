"use client";

import { FC, PropsWithChildren } from "react";
import { ErrorMessage } from "@/components/shared";
import { WalletCard } from "./wallet-card";
import { WalletListSkeleton } from "./wallet-loading";
import { useSearch } from "@/lib/hooks";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query.keys";
import { getAllWalletListApi } from "../wallet.api";
import { SearchInput } from "@/components/shared/form";

export const WalletList = () => {
  const { value, onSearchChange } = useSearch();

  const {
    data: walletList,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [queryKeys.wallet],
    queryFn: () => getAllWalletListApi(),
  });

  if (isLoading) return <LoadingSkeleton />;
  if (isError) throw error;

  const filterWalletList = value ? walletList?.filter((wallet) => wallet.name.toLowerCase().includes(value.toLowerCase())) : walletList;

  return (
    <>
      <SearchInput className="mx-auto mb-6 w-full" value={value} onChange={onSearchChange} placeholder="Search Wallet" />

      {filterWalletList?.length ? (
        <WalletListContainer>
          {filterWalletList?.map((wallet) => (
            <WalletCard key={wallet.id} {...wallet} />
          ))}
        </WalletListContainer>
      ) : (
        <ErrorMessage message="No Wallet Found" className="my-12" />
      )}
    </>
  );
};

const WalletListContainer: FC<PropsWithChildren> = ({ children }) => (
  <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">{children}</section>
);

const LoadingSkeleton = () => (
  <WalletListContainer>
    <WalletListSkeleton size={8} />
  </WalletListContainer>
);
