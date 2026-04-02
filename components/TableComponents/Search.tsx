import { Input } from "@/components/ui/input";
import type { Table } from "@tanstack/react-table";

const Search = <T,>({
  table,
  searchableColumn,
  value,
  onChange,
}: {
  table: Table<T>;
  searchableColumn: string;
  value: string;
  onChange: (value: string) => void;
}) => {
  const column = table.getColumn(searchableColumn);

  return (
    <Input
      placeholder={`Search ${searchableColumn}`}
      className="w-full max-w-sm rounded-xl bg-background"
      value={value}
      onChange={(event) => {
        const val = event.target.value;
        onChange(val);
        column?.setFilterValue(val);
      }}
    />
  );
};

export default Search;
