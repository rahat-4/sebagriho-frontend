"use client";

import { useState } from "react";

import {
  ColumnFiltersState,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type Column,
} from "@tanstack/react-table";

import TableView from "@/components/TableComponents/data-table";
import ResetTable from "@/components/TableComponents/ResetTable";
import Search from "@/components/TableComponents/Search";
import MultiSelectFilter from "@/components/TableComponents/MultiSelectFilter";
import PaginationControls from "@/components/TableComponents/PaginationControls";

import { ColumnDef } from "@tanstack/react-table";

import multiSelectFilterFn from "@/components/TableComponents/CustomFilter";
import {
  toTitleCase,
  SortableHeader,
  getActionsColumn,
} from "@/components/TableComponents/columns";

// Organization type definition (this file appears to be for organizations, not medicines)
type Organization = {
  uid: string;
  name: string;
  parent?: string;
  subdomain?: string;
  created_at: string;
  billing_cycle?: string;
  payment_status?: string;
  status: string;
  organization_type: string;
  amount: number;
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
    header: ({ column }: { column: Column<Organization> }) => (
      <SortableHeader column={column} label={toTitleCase(key)} />
    ),
  })),
  {
    accessorKey: "status",
    header: ({ column }: { column: Column<Organization> }) => (
      <SortableHeader column={column} label="Status" />
    ),
    filterFn: multiSelectFilterFn,
  },
  {
    accessorKey: "organization_type",
    header: ({ column }: { column: Column<Organization> }) => (
      <SortableHeader column={column} label="Organization Type" />
    ),
    filterFn: multiSelectFilterFn,
  },
  {
    accessorKey: "amount",
    header: ({ column }: { column: Column<Organization> }) => (
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

export const columns: ColumnDef<Organization>[] = generateOrganizationColumns();

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Pending", value: "pending" },
  { label: "Deleted", value: "deleted" },
  { label: "Suspended", value: "suspended" },
];

const organizationTypes = [
  { label: "Chamber", value: "chamber" },
  { label: "Diagnostic Center", value: "diagnostic_center" },
  { label: "Homeopathic", value: "homeopathic" },
  { label: "Ayurvedic", value: "ayurvedic" },
  { label: "Veterinary", value: "veterinary" },
  { label: "Pharmacy", value: "pharmacy" },
  { label: "Laboratory", value: "laboratory" },
  { label: "Dental", value: "dental" },
  { label: "Clinic", value: "clinic" },
  { label: "Hospital", value: "hospital" },
];

const DataTable = ({ data }: { data: Organization[] }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [searchValue, setSearchValue] = useState("");

  const handleReset = () => {
    setSearchValue("");
    setColumnFilters([]);
    setSorting([]);
  };

  const table = useReactTable<Organization>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
  });
  return (
    <div>
      <div className="flex items-center justify-between py-2">
        {/* Left side: Search and Filter */}
        <div className="flex items-center space-x-2">
          <Search
            table={table}
            searchableColumn="name"
            value={searchValue}
            onChange={setSearchValue}
          />
          <MultiSelectFilter
            table={table}
            options={statusOptions}
            label="Status"
            columnId="status"
          />
          <MultiSelectFilter
            table={table}
            options={organizationTypes}
            label="Organization Type"
            columnId="organization_type"
          />
        </div>
        <ResetTable table={table} onReset={handleReset} />
      </div>
      <TableView table={table} />
      <PaginationControls table={table} />
    </div>
  );
};

export default DataTable;
