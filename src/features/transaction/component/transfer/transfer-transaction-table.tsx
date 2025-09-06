"use client";

import { format } from "date-fns";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { getTransferTransactionsApi } from "../../transaction.api";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query.keys";
import { usePagination } from "@/lib/hooks";
import { DataTable } from "@/components/shared/data-table/data-table";
import { CommonAvatar, TooltipContainer } from "@/components/shared";
import { DeleteTransferTransaction } from "./delete-transfer-transaction";
import { TransferTransactionFilter } from "./transfer-transaction-filter";
import { TTransferTransactionFilterFormData } from "../../transaction.schema";
import { Button } from "@/components/ui/button";
import { FunnelXIcon } from "lucide-react";
import { useState } from "react";

type TApiResponse = Awaited<ReturnType<typeof getTransferTransactionsApi>>;
type TTransaction = TApiResponse["data"][number];

const { accessor } = createColumnHelper<TTransaction>();

export const TransferTransactionTable = () => {
  const { pagination, setPagination } = usePagination(10);
  const [filter, setFilter] = useState<TTransferTransactionFilterFormData>({});

  const { data: apiResponse, isLoading } = useQuery({
    queryKey: [queryKeys.transaction.transfer, { page: pagination.pageIndex + 1, ...filter }],
    queryFn: () =>
      getTransferTransactionsApi({
        page: String(pagination.pageIndex + 1),
        limit: String(pagination.pageSize),
        ...(filter.startDate && { startDate: filter.startDate.toISOString() }),
        ...(filter.endDate && { endDate: filter.endDate.toISOString() }),
      }),
  });

  const transactions = apiResponse?.data ?? [];

  const column = [
    accessor("wallet.name", {
      header: "Sender Wallet",
      cell: ({ getValue }) => (
        <div className="flex items-center gap-3">
          <CommonAvatar name={getValue()} containerClassName="rounded-full" fallbackClassName="bg-primary text-white text-base" size="SM" />
          <h2 className="font-semibold">{getValue()}</h2>
        </div>
      ),
    }),

    accessor("relatedWallet.name", {
      header: "Receiver Wallet",
      cell: ({ getValue }) => (
        <div className="flex items-center gap-3">
          <CommonAvatar name={getValue()} containerClassName="rounded-full" fallbackClassName="bg-primary text-white text-base" size="SM" />
          <h2 className="font-semibold">{getValue()}</h2>
        </div>
      ),
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

        return <p className="text-emerald-500">{Number(amount).toLocaleString("id-ID")}</p>;
      },
    },

    {
      id: "fee",
      header: "Fee",
      cell: ({ row }) => {
        const fee = row.original.fee;

        return <p className="text-destructive">{Number(fee).toLocaleString("id-ID")}</p>;
      },
    },

    accessor("date", {
      header: "Date",
      cell: ({ getValue }) => <p className="text-sm">{format(getValue(), "PPP")}</p>,
    }),

    {
      id: "action",
      cell: ({ row }) => <DeleteTransferTransaction id={row.original.id} />,
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
      header={<TransferTransactionTableHead filter={filter} onFilterChange={setFilter} />}
    />
  );
};

type TransferTransactionTableHeadProps = {
  filter?: TTransferTransactionFilterFormData;
  onFilterChange: (data: TTransferTransactionFilterFormData) => void;
};

const TransferTransactionTableHead: React.FC<TransferTransactionTableHeadProps> = ({ filter, onFilterChange }) => (
  <div className="flex items-center gap-2">
    <h2 className="mr-auto text-lg font-semibold">All Transactions</h2>

    {!!Object.keys(filter ?? {}).length && (
      <TooltipContainer label="Reset Filter">
        <Button variant="destructive_outline" onClick={() => onFilterChange({})}>
          <FunnelXIcon className="size-4" />
        </Button>
      </TooltipContainer>
    )}

    <TransferTransactionFilter filter={filter} onFilterChange={onFilterChange} />
  </div>
);
