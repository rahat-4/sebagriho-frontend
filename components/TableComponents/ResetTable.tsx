import { Button } from "@/components/ui/button";

interface ResetTableProps {
  table: any;
  onReset: () => void;
}
const ResetTable = ({ table, onReset }: ResetTableProps) => {
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
