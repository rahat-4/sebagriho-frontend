"use client";

import { ColumnDef } from "@tanstack/react-table";

import multiSelectFilterFn from "@/components/TableComponents/CustomFilter";
import {
  toTitleCase,
  SortableHeader,
  getActionsColumn,
} from "@/components/TableComponents/columns";

// Organization type definition
type Organization = {
  id: string;
  name: string;
  parent: string;
  subdomain: string;
  organization_type: string;
  status: string;
  created_at: string;
  amount: number;
  billing_cycle: string;
  payment_status: string;
};

const generateOrganizationColumns = (): ColumnDef<Organization>[] => [
  ...[
    "name",
    "parent",
    "subdomain",
    "created at",
    "billing Cycle",
    "payment Status",
  ].map((key) => ({
    accessorKey: key,
    header: ({ column }: any) => (
      <SortableHeader column={column} label={toTitleCase(key)} />
    ),
  })),
  {
    accessorKey: "status",
    header: ({ column }: any) => (
      <SortableHeader column={column} label="Status" />
    ),
    filterFn: multiSelectFilterFn,
  },
  {
    accessorKey: "organization Type",
    header: ({ column }: any) => (
      <SortableHeader column={column} label="Organization Type" />
    ),
    filterFn: multiSelectFilterFn,
  },
  {
    accessorKey: "amount",
    header: ({ column }: any) => (
      <SortableHeader column={column} label="Amount" />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-BD", {
        style: "currency",
        currency: "BDT",
      }).format(amount);
      return <div>{formatted}</div>;
    },
  },
  getActionsColumn<Organization>(),
];

export const columns = generateOrganizationColumns();
