"use client";

import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { getRegularTransactionsApi } from "../transaction.api";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query.keys";
import { ETransactionType } from "@/server/modules/transaction/transaction.interface";
import { usePagination } from "@/lib/hooks";
import { DataTable } from "@/components/shared/data-table/data-table";
import { CommonAvatar } from "@/components/shared";
import { format } from "date-fns";

type TApiResponse = Awaited<ReturnType<typeof getRegularTransactionsApi>>;
type TTransaction = TApiResponse["transactions"][number];

const { accessor } = createColumnHelper<TTransaction>();

export const RegularTransactionList = () => {
  const { pagination, setPagination } = usePagination(10);
  const { data: apiResponse, isLoading } = useQuery({
    queryKey: [queryKeys.transaction, { type: ETransactionType.regular, page: pagination.pageIndex + 1 }],
    queryFn: () => getRegularTransactionsApi({ page: String(pagination.pageIndex + 1), limit: String(pagination.pageSize) }),
  });

  const transactions = apiResponse?.transactions ?? [];

  const column = [
    accessor("walletName", {
      header: "Wallet",
      cell: ({ getValue }) => (
        <div className="flex items-center gap-3">
          <CommonAvatar name={getValue()} containerClassName="rounded-full" fallbackClassName="bg-primary text-white text-base" size="SM" />
          <h2 className="font-semibold">{getValue()}</h2>
        </div>
      ),
    }),
    accessor("sourceName", {
      header: "Source",
      cell: ({ getValue }) => <p className="font-medium">{getValue()}</p>,
    }),

    accessor("description", {
      header: "Description",
      cell: ({ getValue }) => <p className="text-sm">{getValue()}</p>,
    }),
    {
      id: "amount",
      header: "Amount",
      cell: ({ row }) => {
        const amount = row.original.amount;
        const nature = row.original.nature;

        return (
          <p data-nature={nature} className="data-[nature=expense]:text-destructive data-[nature=income]:text-emerald-500">
            {amount.toLocaleString("id-ID")}
          </p>
        );
      },
    },
    accessor("date", {
      header: "Date",
      cell: ({ getValue }) => <p className="text-sm">{format(getValue(), "PPP")}</p>,
    }),
  ] as ColumnDef<TTransaction>[];

  return (
    <DataTable
      columns={column}
      data={transactions}
      isLoading={isLoading}
      pageCount={apiResponse?.meta?.totalPage ?? 0}
      pagination={pagination}
      onPaginationChange={setPagination}
    />
  );
};
