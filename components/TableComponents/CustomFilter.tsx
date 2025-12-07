import { Row } from "@tanstack/react-table";

export default function multiSelectFilterFn<T>(
  row: Row<T>,
  columnId: string,
  filterValue: string[]
) {
  const value = row.getValue(columnId)?.toString().toLowerCase();

  return value ? filterValue.includes(value) : false;
}
