"use client";

import { cn } from "@/lib/utils";
import { FC } from "react";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { getPeerTransactionsApi } from "../transaction.api";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query.keys";
import { usePagination } from "@/lib/hooks";
import { DataTable } from "@/components/shared/data-table/data-table";
import { CommonAvatar } from "@/components/shared";
import { format } from "date-fns";
import { ETransactionType } from "@/server/db/schema";
import { UpdatePeerTransaction } from "./update-peer-transaction";
import { DeletePeerTransaction } from "./delete-peer-transaction";

type TApiResponse = Awaited<ReturnType<typeof getPeerTransactionsApi>>;
type TTransaction = TApiResponse["data"][number];

const { accessor } = createColumnHelper<TTransaction>();

export const PeerTransactionTable = () => {
  const { pagination, setPagination } = usePagination(10);
  const { data: apiResponse, isLoading } = useQuery({
    queryKey: [queryKeys.transaction.peer, { page: pagination.pageIndex + 1 }],
    queryFn: () =>
      getPeerTransactionsApi({
        page: String(pagination.pageIndex + 1),
        limit: String(pagination.pageSize),
      }),
  });

  const transactions = apiResponse?.data ?? [];

  const columns = [
    accessor("contact.name", {
      header: "Contact",
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
        const type = row.original.type;
        const sign = type === ETransactionType.borrow ? "+" : "-";

        return (
          <p
            className={cn(
              "font-medium",
              type === ETransactionType.lend && "text-destructive",
              type === ETransactionType.borrow && "text-emerald-500",
            )}
          >
            {sign} {Number(amount).toLocaleString("id-ID")}
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
      cell: ({ row }) => <PeerTransactionActionMenu {...row.original} />,
    },
  ] as ColumnDef<TTransaction>[];

  return (
    <DataTable
      columns={columns}
      data={transactions}
      isLoading={isLoading}
      pageCount={apiResponse?.meta?.totalPage ?? 0}
      pagination={pagination}
      onPaginationChange={setPagination}
    />
  );
};

const PeerTransactionActionMenu: FC<TTransaction> = (transaction) => {
  return (
    <div className="flex items-center justify-center gap-2">
      <UpdatePeerTransaction
        {...transaction}
        date={new Date(transaction.date)}
        contactId={transaction.contact?.id ?? null}
        walletId={transaction.walletId}
      />
      <DeletePeerTransaction id={transaction.id} />
    </div>
  );
};
