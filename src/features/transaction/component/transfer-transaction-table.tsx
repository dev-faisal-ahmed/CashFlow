"use client";

import { FC } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/data-table/data-table";
import { TTransferTransaction } from "@/server/db/schema";
import { useGetTransferTransactions } from "../transaction.hook";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type TransferTransactionTableProps = {};

export const TransferTransactionTable: FC<TransferTransactionTableProps> = () => {
  const { data, isLoading } = useGetTransferTransactions();

  const columns: ColumnDef<TTransferTransaction>[] = [
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => format(row.getValue("date"), "PPP"),
    },
    {
      accessorKey: "note",
      header: "Note",
      cell: ({ row }) => row.getValue("note") || "-",
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => `$${row.getValue("amount")}`,
    },
    {
      accessorKey: "fee",
      header: "Fee",
      cell: ({ row }) => `$${row.getValue("fee") || 0}`,
    },
    {
      accessorKey: "wallet",
      header: "Sender Wallet",
      cell: ({ row }) => {
        const wallet: any = row.getValue("wallet");
        return wallet?.name;
      },
    },
    {
      accessorKey: "relatedWallet",
      header: "Receiver Wallet",
      cell: ({ row }) => {
        const relatedWallet: any = row.getValue("relatedWallet");
        return relatedWallet?.name;
      },
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <Badge
          className={cn(
            "capitalize",
            row.getValue("type") === "income" && "bg-green-500",
            row.getValue("type") === "expense" && "bg-red-500",
          )}
        >
          {row.getValue("type")}
        </Badge>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data?.transactions || []}
      isLoading={isLoading}
      pagination={data?.meta}
    />
  );
};
