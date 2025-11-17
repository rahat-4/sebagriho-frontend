import { Input } from "@/components/ui/input";

const Search = ({
  table,
  searchableColumn,
  value,
  onChange,
}: {
  table: any;
  searchableColumn: string;
  value: string;
  onChange: (value: string) => void;
}) => {
  const column = table.getColumn(searchableColumn);

  return (
    <Input
      placeholder={`Search by ${searchableColumn}`}
      className="max-w-xs"
      value={value}
      onChange={(event) => {
        const val = event.target.value;
        onChange(val);
        column.setFilterValue(val);
      }}
    />
  );
};

export default Search;
