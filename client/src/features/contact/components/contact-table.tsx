"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useGetAllContacts } from "../contact-hook";
import { DataTable } from "@/components/shared/data-table";
import { TGetAllContactsResponse } from "../contact-api";
import { CommonAvatar } from "@/components/shared";

type TApiResponse = TGetAllContactsResponse[number];

export const ContactTable = () => {
  const { data: apiResponse } = useGetAllContacts();

  const contacts = apiResponse?.contacts;

  const columns: ColumnDef<TApiResponse>[] = [
    {
      id: "info",
      header: "Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <CommonAvatar
            containerClassName="rounded-full"
            fallbackClassName="bg-primary text-white"
            name={row.getValue("name") as string}
            size="MD"
          />
          <div className="spacey-y-2">
            <h2>{row.getValue("name") as string}</h2>
            <p className="text-muted-foreground text-sm">{row.getValue("phone") as string}</p>
          </div>
        </div>
      ),
    },
    { accessorKey: "address", header: "Address" },
    { accessorKey: "given", header: "Given" },
    { accessorKey: "taken", header: "Taken" },
  ];

  return <DataTable columns={columns} data={contacts ?? []} />;
};
