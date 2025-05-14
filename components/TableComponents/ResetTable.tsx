import { Button } from "@/components/ui/button";

const ResetTable = ({ table }: { table: any }) => {
  return (
    <div className="flex justify-end pb-2">
      <Button
        variant="outline"
        onClick={() => {
          table.resetColumnFilters();
          table.resetSorting();
        }}
      >
        Reset all
      </Button>
    </div>
  );
};

export default ResetTable;
