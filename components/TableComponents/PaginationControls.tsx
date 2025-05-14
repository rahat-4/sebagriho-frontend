import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PaginationControls = ({ table }: { table: any }) => {
  const pageCount = table.getPageCount();
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const totalRows = table.getPrePaginationRowModel().rows.length;

  const from = totalRows ? pageIndex * pageSize + 1 : 0;
  const to = Math.min((pageIndex + 1) * pageSize, totalRows);

  const visiblePages = [pageIndex - 1, pageIndex, pageIndex + 1].filter(
    (i) => i >= 0 && i < pageCount
  );

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0 md:space-x-4 py-4">
      {/* Entry info */}
      <div className="text-sm text-muted-foreground">
        Showing {from} to {to} of {totalRows} entries
      </div>

      {/* Page controls */}
      <div className="flex items-center space-x-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.setPageIndex(0)}
          disabled={pageIndex === 0}
        >
          First
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {visiblePages.map((i) => (
          <Button
            key={i}
            variant={i === pageIndex ? "default" : "outline"}
            size="sm"
            onClick={() => table.setPageIndex(i)}
          >
            {i + 1}
          </Button>
        ))}

        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.setPageIndex(pageCount - 1)}
          disabled={totalRows === 0 || pageIndex === pageCount - 1}
        >
          Last
        </Button>
      </div>

      {/* Rows per page */}
      <div className="text-sm">
        Rows per page:{" "}
        <select
          disabled={totalRows === 0}
          className="border rounded px-2 py-1 ml-2"
          value={pageSize}
          onChange={(e) => table.setPageSize(Number(e.target.value))}
        >
          {[5, 10, 20, 50].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
export default PaginationControls;
