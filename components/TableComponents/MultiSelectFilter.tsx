import { useMemo } from "react";
import { Table } from "@tanstack/react-table";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { LucideFilter } from "lucide-react";

type FilterOption = {
  label: string;
  value: string;
};

type MultiSelectFilterProps<T> = {
  table: Table<T>;
  columnId: keyof T & string;
  options: FilterOption[];
  label?: string;
};

const MultiSelectFilter = <T extends object>({
  table,
  columnId,
  options,
  label = "Filter",
}: MultiSelectFilterProps<T>) => {
  const column = table.getColumn(columnId);
  const selected = (column?.getFilterValue() ?? []) as string[];

  const toggleOption = (value: string) => {
    const updated = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];
    column?.setFilterValue(updated.length ? updated : undefined);
  };

  const optionCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    table.getPreFilteredRowModel().rows.forEach((row) => {
      const value = row.getValue(columnId)?.toString().toLowerCase();
      if (value) counts[value] = (counts[value] || 0) + 1;
    });
    return counts;
  }, [table, columnId]);

  // Clear all filters for this column
  const clearFilters = () => {
    column?.setFilterValue(undefined);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="font-bold cursor-pointer">
          <LucideFilter className="h-4 w-4" />
          {label} {selected.length > 0 ? `(${selected.length})` : ""}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-1 w-[220px]">
        <Command>
          <CommandInput placeholder={`Search ${label.toLowerCase()}...`} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2 cursor-pointer">
                    <Checkbox
                      className="cursor-pointer"
                      id={option.value}
                      checked={selected.includes(option.value)}
                      onCheckedChange={() => toggleOption(option.value)}
                    />
                    <Label
                      htmlFor={option.value}
                      className="text-xs  cursor-pointer"
                    >
                      {option.label}
                    </Label>
                  </div>
                  <span className="text-muted-foreground text-xs">
                    {optionCounts[option.value.toLowerCase()] || 0}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
            {selected.length > 0 && (
              <div className="border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs w-full text-muted-foreground cursor-pointer"
                  onClick={clearFilters}
                >
                  Clear filters
                </Button>
              </div>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default MultiSelectFilter;
