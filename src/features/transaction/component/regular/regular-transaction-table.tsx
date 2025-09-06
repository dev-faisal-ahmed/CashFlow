"use client";

import { FC, useState } from "react";
import { format } from "date-fns";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { getRegularTransactionsApi } from "../../transaction.api";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query.keys";
import { usePagination } from "@/lib/hooks";
import { DataTable } from "@/components/shared/data-table/data-table";
import { CommonAvatar, TooltipContainer } from "@/components/shared";
import { UpdateRegularTransaction } from "./update-regular-transaction";
import { DeleteRegularTransaction } from "./delete-regular-transaction";
import { RegularTransactionFilter } from "./regular-transaction-filter";
import { TRegularTransactionFilterFormData } from "../../transaction.schema";
import { Button } from "@/components/ui/button";
import { FunnelXIcon } from "lucide-react";

type TApiResponse = Awaited<ReturnType<typeof getRegularTransactionsApi>>;
type TTransaction = TApiResponse["data"][number];

const { accessor } = createColumnHelper<TTransaction>();

export const RegularTransactionTable = () => {
  const { pagination, setPagination } = usePagination(10);
  const [filter, setFilter] = useState<TRegularTransactionFilterFormData>({});

  const { data: apiResponse, isLoading } = useQuery({
    queryKey: [queryKeys.transaction.regular, { page: pagination.pageIndex + 1, ...filter }],
    queryFn: () =>
      getRegularTransactionsApi({
        page: String(pagination.pageIndex + 1),
        limit: String(pagination.pageSize),
        ...(filter.type && { type: filter.type }),
        ...(filter.startDate && { startDate: filter.startDate.toISOString() }),
        ...(filter.endDate && { endDate: filter.endDate.toISOString() }),
      }),
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
      header={<RegularTransactionTableHeader filter={filter} onFilterChange={setFilter} />}
    />
  );
};

const RegularTransactionActionMenu: FC<TTransaction> = (transaction) => {
  // Convert the date string to a Date object
  const transactionWithDate = {
    ...transaction,
    date: new Date(transaction.date),
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <UpdateRegularTransaction {...transactionWithDate} categoryId={transaction.category?.id ?? null} walletId={transaction.wallet.id} />
      <DeleteRegularTransaction id={transaction.id} />
    </div>
  );
};

type RegularTransactionTableHeader = {
  filter?: TRegularTransactionFilterFormData;
  onFilterChange: (data: TRegularTransactionFilterFormData) => void;
};

const RegularTransactionTableHeader: FC<RegularTransactionTableHeader> = ({ filter, onFilterChange }) => (
  <div className="flex items-center gap-2">
    <h2 className="mr-auto text-lg font-semibold">All Transactions</h2>

    {!!Object.keys(filter ?? {}).length && (
      <TooltipContainer label="Reset Filter">
        <Button className="" variant="destructive_outline" onClick={() => onFilterChange({})}>
          <FunnelXIcon className="size-4" />
        </Button>
      </TooltipContainer>
    )}

    <RegularTransactionFilter filter={filter} onFilterChange={onFilterChange} />
  </div>
);
