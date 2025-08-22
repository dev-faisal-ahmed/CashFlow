import { FC } from "react";
import { queryKeys } from "@/lib/query.keys";
import { useQuery } from "@tanstack/react-query";
import { getWalletListWithBasicDataApi } from "../wallet.api";
import { CommonSelect } from "@/components/shared/form";
import { Skeleton } from "@/components/ui/skeleton";

type WalletSelectionProps = {
  value: string;
  onChange: (value: string) => void;
  skipWalletId?: string;
  isSaving?: boolean;
};

export const WalletSelection: FC<WalletSelectionProps> = ({ value, onChange, skipWalletId, isSaving }) => {
  console.log(isSaving);

  const { data: walletList, isLoading } = useQuery({
    queryKey: [queryKeys.wallet, "basic", { isSaving }],
    queryFn: () => getWalletListWithBasicDataApi({ ...(typeof isSaving === "boolean" && { isSaving: isSaving ? "true" : "false" }) }),
    select: (res) => res.map((wallet) => ({ value: wallet._id, label: wallet.name })),
  });

  if (isLoading) return <Skeleton className="h-input" />;

  const filteredWalletList = skipWalletId ? walletList?.filter((wallet) => wallet.value !== skipWalletId) : walletList;

  return (
    <CommonSelect
      value={value}
      onChange={onChange}
      options={filteredWalletList ?? []}
      placeholder="Select destination wallet"
      disabled={!filteredWalletList?.length}
    />
  );
};
