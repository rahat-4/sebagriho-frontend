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

import { columns, type Organization } from "./OrganizationColumns";

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
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-white/90 p-4 shadow-sm backdrop-blur lg:grid lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
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
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-white/90 shadow-sm backdrop-blur">
        <TableView table={table} />
      </div>
      <PaginationControls table={table} />
    </div>
  );
};

export default DataTable;
