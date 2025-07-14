"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useGetAllContacts } from "../contact-hook";
import { DataTable } from "@/components/shared/data-table";
import { TGetAllContactsResponse } from "../contact-api";

type TApiResponse = TGetAllContactsResponse[number];

export const ContactTable = () => {
  const { data: apiResponse } = useGetAllContacts();

  const contacts = apiResponse?.contacts;

  const columns: ColumnDef<TApiResponse>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "phone", header: "Phone" },
    { accessorKey: "address", header: "Address" },
    { accessorKey: "given", header: "Given" },
    { accessorKey: "taken", header: "Taken" },
  ];

  return <DataTable columns={columns} data={contacts ?? []} />;
};
