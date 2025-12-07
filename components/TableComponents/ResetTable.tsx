import { Button } from "@/components/ui/button";
import type { Table } from "@tanstack/react-table";

interface ResetTableProps<T> {
  table: Table<T>;
  onReset: () => void;
}
const ResetTable = <T,>({ table, onReset }: ResetTableProps<T>) => {
  return (
    <div className="flex justify-end pb-2">
      <Button
        variant="outline"
        onClick={() => {
          table.resetColumnFilters();
          table.resetSorting();
          onReset();
        }}
      >
        Reset all
      </Button>
    </div>
  );
};

export default ResetTable;
