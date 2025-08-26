"use client";

import { FC, PropsWithChildren } from "react";
import { ErrorMessage } from "@/components/shared";
import { WalletCard } from "./wallet-card";
import { WalletListSkeleton } from "./wallet-loading";
import { useSearch } from "@/lib/hooks";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query.keys";
import { getAllWalletListApi } from "../wallet.api";

export const WalletList = () => {
  const { value } = useSearch();

  const {
    data: walletList,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [queryKeys.wallet],
    queryFn: () => getAllWalletListApi({ search: value }),
  });

  if (isLoading) return <LoadingSkeleton />;
  if (isError) throw error;
  if (!walletList?.length) return <ErrorMessage message="No Wallet Found" className="my-12" />;

  return (
    <WalletListContainer>
      {walletList.map((wallet) => (
        <WalletCard key={wallet.id} {...wallet} />
      ))}
    </WalletListContainer>
  );
};

const WalletListContainer: FC<PropsWithChildren> = ({ children }) => (
  <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">{children}</section>
);

const LoadingSkeleton = () => (
  <WalletListContainer>
    <WalletListSkeleton size={8} />
  </WalletListContainer>
);
