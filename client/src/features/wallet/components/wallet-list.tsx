"use client";

import { QK } from "@/lib/query-keys";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getWalletList } from "../wallet-api";
import { WalletCard } from "./wallet-card";

export const WalletList = () => {
  const { data: walletList } = useSuspenseQuery({
    queryKey: [QK.WALLET],
    queryFn: () => getWalletList(),
    select: (res) => res.data,
  });

  return (
    <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {walletList.map((wallet) => (
        <WalletCard key={wallet._id} {...wallet} />
      ))}
    </section>
  );
};
