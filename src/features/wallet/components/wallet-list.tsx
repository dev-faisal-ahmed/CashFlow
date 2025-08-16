"use client";

import { GetAllWalletsArgs } from "@/server/modules/wallet/wallet.validation";
import { useQuery } from "@tanstack/react-query";
import { WalletCard } from "./wallet-card";
import { ErrorMessage } from "@/components/shared";
import { queryKeys } from "@/lib/query.keys";
import { ToString } from "@/lib/types";
import { walletClient } from "@/lib/client";
import { walletSchema } from "../wallet-schema";
import { WalletListSkeleton } from "./wallet-loading";
import { FC, PropsWithChildren } from "react";

export const WalletList = () => {
  const { data: walletList, isLoading } = useQuery({
    queryKey: [queryKeys.wallet],
    queryFn: () => getAllWalletList({ getAll: "true", fields: "_id,name,isSaving,balance" }),
    select: (res) => res,
  });

  if (isLoading) return <LoadingSkeleton />;
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
const getAllWalletList = async (args: ToString<GetAllWalletsArgs>) => {
  const res = await walletClient.index.$get({ query: args });
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  const validatedData = await walletSchema.getWalletListDataSchema.parseAsync(resData.data);
  return validatedData;
};
