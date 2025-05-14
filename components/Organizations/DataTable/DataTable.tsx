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
} from "@tanstack/react-table";

import TableView from "@/components/TableComponents/data-table";
import ResetTable from "@/components/TableComponents/ResetTable";
import Search from "@/components/TableComponents/Search";
import MultiSelectFilter from "@/components/TableComponents/MultiSelectFilter";
import PaginationControls from "@/components/TableComponents/PaginationControls";

import { columns } from "./OrganizationColumns";

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

interface DataTableProps<TData extends object> {
  data: TData[];
}

const DataTable = <TData extends object>({ data }: DataTableProps<TData>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [searchValue, setSearchValue] = useState("");

  const handleReset = () => {
    setSearchValue("");
    setColumnFilters([]);
    setSorting([]);
  };

  const table = useReactTable({
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
            columnId="organizationType"
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
