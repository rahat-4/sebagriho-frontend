import { Row } from "@tanstack/react-table";

export default function multiSelectFilterFn<T>(
  row: Row<T>,
  columnId: string,
  filterValue: string[]
) {
  const rowValue = row.getValue(columnId)?.toString().toLowerCase();

  return filterValue.includes(rowValue);
}
