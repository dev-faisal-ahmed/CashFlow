"use client";

import { FC } from "react";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { CommonAvatar } from "@/components/shared";
import { MinusIcon, PlusIcon } from "lucide-react";
import { DataTable } from "@/components/shared/data-table/data-table";
import { UpdateContact } from "./update-contact";
import { DeleteContact } from "./delete-contact";
import { usePagination } from "@/lib/hooks";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query.keys";
import { getContactsApi } from "../contact.api";

type TApiResponse = Awaited<ReturnType<typeof getContactsApi>>;
type TContact = NonNullable<TApiResponse>["data"][number];

// Accessor
const { accessor } = createColumnHelper<TContact>();

export const ContactTable = () => {
  const { pagination, setPagination } = usePagination(10);
  const { data: apiResponse, isLoading } = useQuery({
    queryKey: [queryKeys.contact, { page: pagination.pageIndex + 1 }],
    queryFn: () => getContactsApi({ page: String(pagination.pageIndex + 1), limit: String(pagination.pageSize) }),
    select: (res) => ({
      contacts: res.data,
      meta: res.meta,
    }),
  });

  const contacts = apiResponse?.contacts ?? [];

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
        const net = Number(row.original.taken) - Number(row.original.given);
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
      cell: ({ row }) => <ContactActionMenu {...row.original} />,
    },
  ] as ColumnDef<TContact>[];

  return (
    <DataTable
      columns={column}
      data={contacts}
      isLoading={isLoading}
      pageCount={apiResponse?.meta?.totalPage ?? 0}
      pagination={pagination}
      onPaginationChange={setPagination}
    />
  );
};

const ContactActionMenu: FC<TContact> = ({ id, name, phone, address }) => {
  return (
    <div className="flex items-center justify-center gap-2">
      <UpdateContact id={id} name={name} phone={phone} address={address} />
      <DeleteContact id={id} />
    </div>
  );
};
