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
import { Search, Filter, Package, Calendar, X, Check } from "lucide-react";
import AddHomeopathicMedicine from "./AddMedicine";
import { MedicineFilters } from "@/types/medicine.types";
import { EXPIRATION_OPERATORS } from "@/constants/medicine.constants";

interface FilterComponentsProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filters: MedicineFilters;
  setFilters: (filters: MedicineFilters) => void;
  onApplyFilters?: () => void;
  onMedicineCreated?: () => void;
}

const FilterComponents = ({
  searchTerm,
  setSearchTerm,
  filters,
  setFilters,
  onApplyFilters,
  onMedicineCreated,
}: FilterComponentsProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState<MedicineFilters>(filters);

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.isAvailable !== "all") count++;
    if (filters.expirationDate) count++;
    return count;
  };

  const handleApplyFilters = () => {
    setFilters(tempFilters);
    setIsFilterOpen(false);
    onApplyFilters?.();
  };

  const handleResetFilters = () => {
    const resetFilters: MedicineFilters = {
      isAvailable: "all",
      expirationDate: "",
      expirationOperator: "exact",
    };
    setTempFilters(resetFilters);
    setFilters(resetFilters);
    setIsFilterOpen(false);
    onApplyFilters?.();
  };

  const clearFilter = (filterKey: keyof MedicineFilters) => {
    const newFilters = {
      ...filters,
      [filterKey]: filterKey === "expirationDate" ? "" : "all",
    };
    setFilters(newFilters);
    setTempFilters(newFilters);
    onApplyFilters?.();
  };

  const clearSearch = () => {
    setSearchTerm("");
    onApplyFilters?.();
  };

  const getExpirationFilterDisplay = () => {
    if (!filters.expirationDate) return "";

    return `Expires ${EXPIRATION_OPERATORS[filters.expirationOperator]} ${
      filters.expirationDate
    }`;
  };

  return (
    <div className="w-full mb-1">
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
        <CardContent className="p-1 sm:p-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search by name or manufacturer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 rounded-xl border-slate-200 focus:border-[#2ab7ca] focus:ring-2 focus:ring-[#2ab7ca]/20 text-xs bg-white shadow-sm transition-all duration-200"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
            <div className="flex justify-between gap-3">
              <Button
                variant="outline"
                onClick={() => setIsFilterOpen(true)}
                className="rounded-xl border-slate-200 hover:border-[#2ab7ca] hover:bg-[#e6f7f9] transition-all duration-200 relative"
              >
                <Filter className="h-4 w-4" />
                <span>Filter</span>
                {getActiveFilterCount() > 0 && (
                  <Badge className="ml-2 h-5 w-5 p-0 bg-[#2ab7ca] hover:bg-[#2199aa] rounded-full text-xs flex items-center justify-center">
                    {getActiveFilterCount()}
                  </Badge>
                )}
              </Button>
              <AddHomeopathicMedicine onMedicineCreated={onMedicineCreated} />
            </div>
          </div>

          {(searchTerm || getActiveFilterCount() > 0) && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
              <span className="text-xs text-slate-500 font-medium self-center">
                Active:
              </span>

              {searchTerm && (
                <Badge
                  variant="secondary"
                  className="bg-[#e6f7f9] text-[#2199aa] hover:bg-[#d1f2f5]"
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
            </div>
          )}
        </CardContent>
      </Card>

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
                      expirationOperator: value as "exact" | "gt" | "lt",
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
                  className="rounded-xl border-slate-200 focus:border-[#2ab7ca] focus:ring-2 focus:ring-[#2ab7ca]/20"
                />
              </div>
            </div>
          </div>

          <DrawerFooter className="pt-4 border-t">
            <div className="flex gap-3">
              <Button
                onClick={handleApplyFilters}
                className="flex-1 rounded-xl bg-[#2ab7ca] hover:bg-[#2199aa]"
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
    </div>
  );
};

export default FilterComponents;
