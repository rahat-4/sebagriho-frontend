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
      <Card className="rounded-3xl border-border/60 bg-white/90 shadow-sm backdrop-blur">
        <CardContent className="space-y-4 p-4 sm:p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name or manufacturer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-11 rounded-xl border-border/60 pl-10 pr-4 text-sm shadow-sm transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={() => setIsFilterOpen(true)}
                className="relative rounded-xl border-border/60 transition-all duration-200 hover:border-primary hover:bg-primary/5"
              >
                <Filter className="h-4 w-4" />
                <span>Filter</span>
                {getActiveFilterCount() > 0 && (
                  <Badge className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary p-0 text-xs text-primary-foreground hover:bg-primary">
                    {getActiveFilterCount()}
                  </Badge>
                )}
              </Button>
              <AddHomeopathicMedicine onMedicineCreated={onMedicineCreated} />
            </div>
          </div>

          {(searchTerm || getActiveFilterCount() > 0) && (
            <div className="flex flex-wrap gap-2 border-t border-border/60 pt-3">
              <span className="self-center text-xs font-medium text-muted-foreground">
                Active:
              </span>

              {searchTerm && (
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary hover:bg-primary/15"
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
                  className="bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/15"
                >
                  Status: {" "}
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
                  className="bg-sky-500/10 text-sky-700 hover:bg-sky-500/15"
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
        <DrawerContent className="max-h-[85vh] rounded-t-3xl border-border/60">
          <DrawerHeader className="pb-2">
            <DrawerTitle className="flex items-center gap-2 text-foreground">
              <Filter className="h-5 w-5" />
              Filter Medicines
            </DrawerTitle>
            <DrawerDescription className="text-muted-foreground">
              Apply filters to find specific homeopathic medicines
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4 pb-4 space-y-6">
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Package className="h-4 w-4" />
                Availability Status
              </label>
              <Select
                value={tempFilters.isAvailable}
                onValueChange={(value) =>
                  setTempFilters({ ...tempFilters, isAvailable: value })
                }
              >
                <SelectTrigger className="rounded-xl border-border/60">
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
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
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
                  <SelectTrigger className="rounded-xl border-border/60">
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
                  className="rounded-xl border-border/60 focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>

          <DrawerFooter className="border-t border-border/60 pt-4">
            <div className="flex gap-3">
              <Button
                onClick={handleApplyFilters}
                className="flex-1 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Check className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
              <Button
                variant="outline"
                onClick={handleResetFilters}
                className="flex-1 rounded-xl border-border/60"
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
