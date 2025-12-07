import { ColumnDef, Column } from "@tanstack/react-table";
import { MoreHorizontal, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Converts a string to title case by replacing underscores with spaces
export const toTitleCase = (str: string): string => {
  return str
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase());
};

// Sortable header component for the table
export const SortableHeader = <T,>({
  column,
  label,
}: {
  column: Column<T>;
  label: string;
}) => (
  <Button
    variant={"ghost"}
    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  >
    {label}
    <ChevronsUpDown className="h-4 w-4" />
  </Button>
);

// Column definition for the actions column
export const getActionsColumn = <T,>(): ColumnDef<T> => ({
  id: "actions",
  cell: () => (
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
