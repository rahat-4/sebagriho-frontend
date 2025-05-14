import { Input } from "@/components/ui/input";

const Search = ({ table }: { table: any }) => {
  return (
    <Input
      placeholder="Search by name"
      className="max-w-xs"
      value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
      onChange={(event) =>
        table.getColumn("name")?.setFilterValue(event.target.value)
      }
    />
  );
};

export default Search;
