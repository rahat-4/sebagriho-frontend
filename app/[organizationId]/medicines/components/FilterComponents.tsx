import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  Filter,
  SortAsc,
  Grid3X3,
  List,
  Package,
  Calendar,
  X,
  Check,
  SortDesc,
} from "lucide-react";

// Types
interface Filters {
  isAvailable: string;
  expirationDate: string;
  expirationOperator: string; // 'exact', 'gt', 'lt'
}

interface SortOption {
  value: string;
  label: string;
  direction: "asc" | "desc";
}

interface FilterComponentsProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filters: Filters;
  setFilters: (filters: Filters) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  sortDirection: "asc" | "desc";
  setSortDirection: (direction: "asc" | "desc") => void;
  onApplyFilters?: () => void;
}

const FilterComponents = ({
  searchTerm,
  setSearchTerm,
  filters,
  setFilters,
  sortBy,
  setSortBy,
  sortDirection,
  setSortDirection,
  onApplyFilters,
}: FilterComponentsProps) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filter states
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState<Filters>(filters);

  // Sort states
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [tempSort, setTempSort] = useState(sortBy);
  const [tempSortDirection, setTempSortDirection] = useState(sortDirection);

  const sortOptions: SortOption[] = [
    { value: "created_at", label: "Date Added", direction: "desc" },
    {
      value: "created_at",
      label: "Date Added (Oldest First)",
      direction: "asc",
    },
    { value: "name", label: "Name (A-Z)", direction: "asc" },
    { value: "name", label: "Name (Z-A)", direction: "desc" },
    { value: "manufacturer", label: "Manufacturer (A-Z)", direction: "asc" },
    { value: "manufacturer", label: "Manufacturer (Z-A)", direction: "desc" },
    {
      value: "expiration_date",
      label: "Expiry (Latest First)",
      direction: "desc",
    },
    {
      value: "expiration_date",
      label: "Expiry (Earliest First)",
      direction: "asc",
    },
  ];

  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.isAvailable !== "all") count++;
    if (filters.expirationDate && filters.expirationDate !== "") count++;
    return count;
  };

  // Handle filter apply
  const handleApplyFilters = () => {
    setFilters(tempFilters);
    setIsFilterOpen(false);
    if (onApplyFilters) {
      onApplyFilters();
    }
  };

  // Handle filter reset
  const handleResetFilters = () => {
    const resetFilters: Filters = {
      isAvailable: "all",
      expirationDate: "",
      expirationOperator: "exact",
    };
    setTempFilters(resetFilters);
    setFilters(resetFilters);
    setIsFilterOpen(false);
    if (onApplyFilters) {
      onApplyFilters();
    }
  };

  // Handle sort apply
  const handleApplySort = () => {
    setSortBy(tempSort);
    setSortDirection(tempSortDirection);
    setIsSortOpen(false);
    if (onApplyFilters) {
      onApplyFilters();
    }
  };

  // Clear individual filter
  const clearFilter = (filterKey: keyof Filters) => {
    const newFilters = {
      ...filters,
      [filterKey]: filterKey === "expirationDate" ? "" : "all",
    };
    setFilters(newFilters);
    setTempFilters(newFilters);
    if (onApplyFilters) {
      onApplyFilters();
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm("");
    if (onApplyFilters) {
      onApplyFilters();
    }
  };

  // Format expiration filter display
  const getExpirationFilterDisplay = () => {
    if (!filters.expirationDate) return "";

    const operatorLabels = {
      exact: "on",
      gt: "after",
      lt: "before",
    };

    return `Expires ${
      operatorLabels[filters.expirationOperator as keyof typeof operatorLabels]
    } ${filters.expirationDate}`;
  };

  return (
    <div className="w-full">
      {/* Main Controls */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
        <CardContent className="p-4 sm:p-6 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search by name or manufacturer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/50 text-sm bg-white shadow-sm transition-all duration-200"
            />
          </div>

          {/* Action Buttons Row */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
            {/* Filter and Sort Buttons */}
            <div className="flex gap-2 flex-1">
              {/* Filter Button */}
              <Button
                variant="outline"
                onClick={() => setIsFilterOpen(true)}
                className="flex-1 sm:flex-none rounded-xl border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200 relative"
              >
                <Filter className="h-4 w-4" />
                <span>Filter</span>
                {getActiveFilterCount() > 0 && (
                  <Badge className="ml-2 h-5 w-5 p-0 bg-indigo-500 hover:bg-indigo-600 rounded-full text-xs flex items-center justify-center">
                    {getActiveFilterCount()}
                  </Badge>
                )}
              </Button>

              {/* Sort Button */}
              <Button
                variant="outline"
                onClick={() => setIsSortOpen(true)}
                className="flex-1 sm:flex-none rounded-xl border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200"
              >
                {sortDirection === "asc" ? (
                  <SortAsc className="h-4 w-4" />
                ) : (
                  <SortDesc className="h-4 w-4" />
                )}
                <span>Sort</span>
              </Button>
            </div>

            {/* View Toggle */}
            <div className="hidden sm:flex bg-slate-100 rounded-xl p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={`rounded-lg transition-all duration-200 ${
                  viewMode === "grid"
                    ? "bg-white shadow-sm text-slate-900"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Grid3X3 className="h-4 w-4" />
                <span className="ml-1">Grid</span>
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={`rounded-lg transition-all duration-200 ${
                  viewMode === "list"
                    ? "bg-white shadow-sm text-slate-900"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <List className="h-4 w-4" />
                <span className="ml-1">List</span>
              </Button>
            </div>
          </div>

          {/* Active Filters Display */}
          {(searchTerm ||
            getActiveFilterCount() > 0 ||
            sortBy !== "created_at" ||
            sortDirection !== "desc") && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
              <span className="text-xs text-slate-500 font-medium self-center">
                Active:
              </span>

              {searchTerm && (
                <Badge
                  variant="secondary"
                  className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200"
                >
                  Search: {searchTerm}
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={clearSearch}
                  />
                </Badge>
              )}

              {filters.isAvailable !== "all" && (
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800 hover:bg-green-200"
                >
                  Status:{" "}
                  {filters.isAvailable === "true" ? "Available" : "Unavailable"}
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => clearFilter("isAvailable")}
                  />
                </Badge>
              )}

              {filters.expirationDate && (
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800 hover:bg-blue-200"
                >
                  {getExpirationFilterDisplay()}
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => clearFilter("expirationDate")}
                  />
                </Badge>
              )}

              {(sortBy !== "created_at" || sortDirection !== "desc") && (
                <Badge
                  variant="secondary"
                  className="bg-orange-100 text-orange-800 hover:bg-orange-200"
                >
                  Sort:{" "}
                  {
                    sortOptions.find(
                      (opt) =>
                        opt.value === sortBy && opt.direction === sortDirection
                    )?.label
                  }
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Filter Drawer */}
      <Drawer open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader className="pb-2">
            <DrawerTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter Medicines
            </DrawerTitle>
            <DrawerDescription>
              Apply filters to find specific homeopathic medicines
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4 pb-4 space-y-6">
            {/* Availability Filter */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Package className="h-4 w-4" />
                Availability Status
              </label>
              <Select
                value={tempFilters.isAvailable}
                onValueChange={(value) =>
                  setTempFilters({ ...tempFilters, isAvailable: value })
                }
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Medicines</SelectItem>
                  <SelectItem value="true">Available Only</SelectItem>
                  <SelectItem value="false">Unavailable Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Expiration Date Filter */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Expiration Date
              </label>

              <div className="grid grid-cols-2 gap-2">
                <Select
                  value={tempFilters.expirationOperator}
                  onValueChange={(value) =>
                    setTempFilters({
                      ...tempFilters,
                      expirationOperator: value,
                    })
                  }
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="exact">Expires on</SelectItem>
                    <SelectItem value="gt">Expires after</SelectItem>
                    <SelectItem value="lt">Expires before</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  type="date"
                  value={tempFilters.expirationDate}
                  onChange={(e) =>
                    setTempFilters({
                      ...tempFilters,
                      expirationDate: e.target.value,
                    })
                  }
                  className="rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/50"
                />
              </div>
            </div>
          </div>

          <DrawerFooter className="pt-4 border-t">
            <div className="flex gap-3">
              <Button
                onClick={handleApplyFilters}
                className="flex-1 rounded-xl bg-indigo-500 hover:bg-indigo-600"
              >
                <Check className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
              <Button
                variant="outline"
                onClick={handleResetFilters}
                className="flex-1 rounded-xl"
              >
                <X className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Sort Drawer */}
      <Drawer open={isSortOpen} onOpenChange={setIsSortOpen}>
        <DrawerContent className="max-h-[70vh]">
          <DrawerHeader className="pb-2">
            <DrawerTitle className="flex items-center gap-2">
              <SortAsc className="h-5 w-5" />
              Sort Medicines
            </DrawerTitle>
            <DrawerDescription>
              Choose how to sort the medicine list
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4 pb-4 space-y-3 max-h-96 overflow-y-auto">
            {sortOptions.map((option, index) => (
              <Button
                key={`${option.value}-${option.direction}-${index}`}
                variant={
                  tempSort === option.value &&
                  tempSortDirection === option.direction
                    ? "default"
                    : "ghost"
                }
                onClick={() => {
                  setTempSort(option.value);
                  setTempSortDirection(option.direction);
                }}
                className={`w-full justify-start rounded-xl transition-all duration-200 ${
                  tempSort === option.value &&
                  tempSortDirection === option.direction
                    ? "bg-indigo-500 text-white hover:bg-indigo-600"
                    : "hover:bg-slate-100"
                }`}
              >
                {option.direction === "asc" ? (
                  <SortAsc className="h-4 w-4 mr-3" />
                ) : (
                  <SortDesc className="h-4 w-4 mr-3" />
                )}
                {option.label}
                {tempSort === option.value &&
                  tempSortDirection === option.direction && (
                    <Check className="h-4 w-4 ml-auto" />
                  )}
              </Button>
            ))}
          </div>

          <DrawerFooter className="pt-4 border-t">
            <Button
              onClick={handleApplySort}
              className="w-full rounded-xl bg-indigo-500 hover:bg-indigo-600"
            >
              <Check className="h-4 w-4 mr-2" />
              Apply Sort
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default FilterComponents;
