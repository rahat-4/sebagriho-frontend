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
  organizationType: string;
  status: string;
  createdAt: string;
  amount: number;
  billingCycle: string;
  paymentStatus: string;
};

const generateOrganizationColumns = (): ColumnDef<Organization>[] => [
  ...[
    "name",
    "parent",
    "subdomain",
    "organizationType",
    "status",
    "createdAt",
    "billingCycle",
    "paymentStatus",
  ].map((key) => ({
    accessorKey: key,
    header: ({ column }: any) => (
      <SortableHeader column={column} label={toTitleCase(key)} />
    ),
    filterFn: key === "status" ? multiSelectFilterFn : undefined,
  })),
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
