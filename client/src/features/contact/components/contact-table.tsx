"use client";

import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { TGetAllContactsResponse } from "../contact-api";
import { CommonAvatar } from "@/components/shared";
import { MinusIcon, PlusIcon } from "lucide-react";
import { useGetAllContacts } from "../contact-hook";
import { usePagination } from "@/lib/hooks";
import { DataTable } from "@/components/shared/data-table/data-table";

type TApiResponse = TGetAllContactsResponse[number];

const LIMIT = 10;
const { accessor } = createColumnHelper<TApiResponse>();

export const ContactTable = () => {
  const { pagination, setPagination } = usePagination();
  const { data: apiResponse, isLoading } = useGetAllContacts(pagination.pageIndex + 1, LIMIT);

  const contacts = apiResponse?.contacts;

  const column = [
    {
      id: "info",
      header: "Contact Info",
      cell: ({ row }) => (
        <div className="flex items-center gap-4">
          <CommonAvatar
            containerClassName="rounded-full"
            fallbackClassName="bg-primary text-white text-base"
            name={row.original.name}
            size="SM"
          />
          <div className="space-y-1">
            <h2>{row.original.name}</h2>
            <p className="text-muted-foreground text-sm">{row.original.phone}</p>
          </div>
        </div>
      ),
    },

    accessor("address", {
      header: "Address",
      cell: ({ getValue }) => <span className="text-muted-foreground">{getValue()}</span>,
    }),

    accessor("given", {
      header: () => <div className="text-center">Lent</div>,
      cell: ({ getValue }) => (
        <div className="flex items-center justify-center gap-2 text-center text-base font-semibold">
          <MinusIcon className="size-4" />
          {getValue()}
        </div>
      ),
    }),

    accessor("taken", {
      header: () => <div className="text-center">Borrowed</div>,
      cell: ({ getValue }) => (
        <div className="flex items-center justify-center gap-2 text-center text-base font-semibold">
          <PlusIcon className="size-4" />
          {getValue()}
        </div>
      ),
    }),

    {
      id: "net",
      header: () => <div className="text-center">Net</div>,
      cell: ({ row }) => {
        const net = row.original.taken - row.original.given;
        const status = net > 0 ? "Borrowed" : "Lent";

        return (
          <div data-status={status} className="flex items-center justify-center gap-2 text-center text-base font-semibold">
            {net} {!!net && <span className="text-muted-foreground text-sm font-medium">({status})</span>}
          </div>
        );
      },
    },

    {
      id: "action",
      header: () => <div className="text-center">Action</div>,
      cell: () => <div></div>,
    },
  ] as ColumnDef<TApiResponse>[];

  return (
    <DataTable
      columns={column}
      data={contacts ?? []}
      isLoading={isLoading}
      pageCount={apiResponse?.meta?.totalPages ?? 0}
      pagination={pagination}
      onPaginationChange={setPagination}
    />
  );
};
