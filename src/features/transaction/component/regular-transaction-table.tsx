"use client";

import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { getRegularTransactionsApi } from "../transaction.api";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query.keys";
import { usePagination } from "@/lib/hooks";
import { DataTable } from "@/components/shared/data-table/data-table";
import { CommonAvatar } from "@/components/shared";
import { format } from "date-fns";
import { FC } from "react";
import { UpdateRegularTransaction } from "./update-regular-transaction";

type TApiResponse = Awaited<ReturnType<typeof getRegularTransactionsApi>>;
type TTransaction = TApiResponse["data"][number];

const { accessor } = createColumnHelper<TTransaction>();

export const RegularTransactionTable = () => {
  const { pagination, setPagination } = usePagination(10);
  const { data: apiResponse, isLoading } = useQuery({
    queryKey: [queryKeys.transaction, { page: pagination.pageIndex + 1 }],
    queryFn: () => getRegularTransactionsApi({ page: String(pagination.pageIndex + 1), limit: String(pagination.pageSize) }),
  });

  const transactions = apiResponse?.data ?? [];

  const column = [
    accessor("wallet.name", {
      header: "Wallet",
      cell: ({ getValue }) => (
        <div className="flex items-center gap-3">
          <CommonAvatar name={getValue()} containerClassName="rounded-full" fallbackClassName="bg-primary text-white text-base" size="SM" />
          <h2 className="font-semibold">{getValue()}</h2>
        </div>
      ),
    }),
    accessor("category.name", {
      header: "Source",
      cell: ({ getValue }) => <p className="font-medium">{getValue()}</p>,
    }),

    accessor("note", {
      header: "Note",
      cell: ({ getValue }) => <p className="text-sm">{getValue()}</p>,
    }),

    {
      id: "amount",
      header: "Amount",
      cell: ({ row }) => {
        const amount = row.original.amount;
        const nature = row.original.type;

        return (
          <p data-nature={nature} className="data-[nature=expense]:text-destructive data-[nature=income]:text-emerald-500">
            {Number(amount).toLocaleString("id-ID")}
          </p>
        );
      },
    },
    accessor("date", {
      header: "Date",
      cell: ({ getValue }) => <p className="text-sm">{format(getValue(), "PPP")}</p>,
    }),
    {
      id: "action",
      cell: ({ row }) => <RegularTransactionActionMenu {...row.original} />,
    },
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

const RegularTransactionActionMenu: FC<TTransaction> = (transaction) => (
  <div className="flex items-center justify-center gap-2">
    <UpdateRegularTransaction {...transaction} categoryId={transaction.category?.id ?? null} walletId={transaction.wallet.id} />
  </div>
);
