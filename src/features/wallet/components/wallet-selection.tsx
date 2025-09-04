import { FC } from "react";
import { queryKeys } from "@/lib/query.keys";
import { useQuery } from "@tanstack/react-query";
import { getWalletListWithBasicDataApi } from "../wallet.api";
import { CommonSelect } from "@/components/shared/form";
import { Skeleton } from "@/components/ui/skeleton";

type WalletSelectionProps = {
  value: number;
  onChange: (value: number) => void;
  skipWalletId?: string;
  isSaving?: boolean;
  disabled?: boolean;
  placeholder?: string;
};

export const WalletSelection: FC<WalletSelectionProps> = ({ value, onChange, skipWalletId, isSaving, disabled, placeholder }) => {
  const { data: walletList, isLoading } = useQuery({
    queryKey: [queryKeys.wallet, "basic", { isSaving }],
    queryFn: () => getWalletListWithBasicDataApi({ ...(typeof isSaving === "boolean" && { isSaving: isSaving ? "true" : "false" }) }),
    select: (res) => res.map((wallet) => ({ value: wallet.id.toString(), label: wallet.name })),
  });

  if (isLoading) return <Skeleton className="h-input" />;

  const filteredWalletList = skipWalletId ? walletList?.filter((wallet) => wallet.value !== skipWalletId) : walletList;

  return (
    <CommonSelect
      value={value?.toString() ?? ""}
      onChange={(value) => onChange(Number(value))}
      options={filteredWalletList ?? []}
      placeholder={placeholder ?? ""}
      disabled={disabled}
    />
  );
};
