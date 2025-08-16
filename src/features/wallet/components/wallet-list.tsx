"use client";

import { FC, PropsWithChildren } from "react";
import { useQuery } from "@tanstack/react-query";
import { ErrorMessage } from "@/components/shared";
import { queryKeys } from "@/lib/query.keys";
import { walletClient } from "@/lib/client";
import { WalletCard } from "./wallet-card";
import { walletSchema } from "../wallet-schema";
import { WalletListSkeleton } from "./wallet-loading";

export const WalletList = () => {
  const {
    data: walletList,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [queryKeys.wallet],
    queryFn: getAllWalletListApi,
  });

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

// api calling
const getAllWalletListApi = async () => {
  const res = await walletClient.index.$get({ query: { getAll: "true", fields: "_id,name,isSaving,balance" } });
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  const validatedData = await walletSchema.walletListData.parseAsync(resData.data);
  return validatedData;
};
