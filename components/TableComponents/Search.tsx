import { Input } from "@/components/ui/input";

const Search = ({
  table,
  searchableColumn,
}: {
  table: any;
  searchableColumn: string;
}) => {
  const column = table.getColumn(searchableColumn);
  const filterValue = column.getFilterValue() as string;

  return (
    <Input
      placeholder={`Search by ${searchableColumn}`}
      className="max-w-xs"
      value={filterValue}
      onChange={(event) => column.setFilterValue(event.target.value)}
    />
  );
};

export default Search;
