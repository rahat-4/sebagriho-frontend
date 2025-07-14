"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface AppointmentFiltersProps {
  sortOrder: "asc" | "desc";
  setSortOrder: (order: "asc" | "desc") => void;
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  showDatePicker: boolean;
  setShowDatePicker: (show: boolean) => void;
  appointmentCount: number;
}

export const AppointmentFilters = ({
  sortOrder,
  setSortOrder,
  dateRange,
  setDateRange,
  showDatePicker,
  setShowDatePicker,
  appointmentCount,
}: AppointmentFiltersProps) => {
  const hasDateFilter = dateRange.from || dateRange.to;

  const formatDateRange = () => {
    if (dateRange.from && dateRange.to) {
      return `${format(dateRange.from, "MMM dd, yyyy")} - ${format(
        dateRange.to,
        "MMM dd, yyyy"
      )}`;
    } else if (dateRange.from) {
      return `From ${format(dateRange.from, "MMM dd, yyyy")}`;
    } else if (dateRange.to) {
      return `Until ${format(dateRange.to, "MMM dd, yyyy")}`;
    }
    return "";
  };

  const clearDateFilter = () => {
    setDateRange({ from: undefined, to: undefined });
  };

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-row justify-between gap-2">
        {/* Date Range Picker */}
        <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[200px] text-sm justify-start text-left font-normal",
                !dateRange.from && !dateRange.to && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {hasDateFilter ? formatDateRange() : "Select date range"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              defaultMonth={dateRange.from}
              selected={{
                from: dateRange.from,
                to: dateRange.to,
              }}
              onSelect={(range) => {
                setDateRange({
                  from: range?.from,
                  to: range?.to,
                });
              }}
              numberOfMonths={2}
            />
            <div className="p-3 border-t">
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setDateRange({ from: undefined, to: undefined });
                    setShowDatePicker(false);
                  }}
                >
                  Clear
                </Button>
                <Button size="sm" onClick={() => setShowDatePicker(false)}>
                  Apply
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Sort Order */}
        <Select
          value={sortOrder}
          onValueChange={(value) => setSortOrder(value as "asc" | "desc")}
        >
          <SelectTrigger className="w-40" size="sm">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Newest First</SelectItem>
            <SelectItem value="asc">Oldest First</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Active Filters */}
      {hasDateFilter && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-slate-600">Active filters:</span>
          <Badge variant="secondary" className="gap-1">
            Date: {formatDateRange()}
            <X className="h-3 w-3 cursor-pointer" onClick={clearDateFilter} />
          </Badge>
        </div>
      )}
    </div>
  );
};
