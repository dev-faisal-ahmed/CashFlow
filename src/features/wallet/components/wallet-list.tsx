"use client";

import { FC, PropsWithChildren } from "react";
import { ErrorMessage } from "@/components/shared";
import { WalletCard } from "./wallet-card";
import { WalletListSkeleton } from "./wallet-loading";
import { useGetWallet } from "../wallet.hook";

export const WalletList = () => {
  const { data: walletList, isLoading, isError, error } = useGetWallet();

  if (isLoading) return <LoadingSkeleton />;
  if (isError) throw error;
  if (!walletList?.length) return <ErrorMessage message="No Wallet Found" className="my-12" />;

  return (
    <WalletListContainer>
      {walletList.map((wallet) => (
        <WalletCard key={wallet._id} {...wallet} />
      ))}
    </WalletListContainer>
  );
};

const WalletListContainer: FC<PropsWithChildren> = ({ children }) => (
  <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">{children}</section>
);

const LoadingSkeleton = () => (
  <WalletListContainer>
    <WalletListSkeleton size={4} />
  </WalletListContainer>
);
