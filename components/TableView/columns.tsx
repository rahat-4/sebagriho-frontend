"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Converts a string to title case by replacing underscores with spaces
const toTitleCase = (str: string): string => {
  return str
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase());
};

// Sortable header component for the table
const SortableHeader = ({ column, label }: { column: any; label: string }) => (
  <Button
    variant={"ghost"}
    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  >
    {label}
    <ChevronsUpDown className="h-4 w-4" />
  </Button>
);

// Column definition for the actions column
const getActionsColumn = <T,>(): ColumnDef<T> => ({
  id: "actions",
  cell: ({ row }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
});

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
