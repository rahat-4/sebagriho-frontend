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
  Users,
  Hash,
  X,
  Check,
  Dna,
} from "lucide-react";
import AddPatientDialog from "./AddPatientComponents";
import { PatientFilters } from "@/types/patient.types";
import {
  MIASM_OPTIONS,
  BLOOD_GROUP_OPTIONS,
  GENDER_OPTIONS,
  SORT_OPTIONS,
} from "@/constants/patient.constants";

interface FilterComponentsProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filters: PatientFilters;
  setFilters: (filters: PatientFilters) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  onPatientCreated?: () => void;
}

const FilterComponents = ({
  searchTerm,
  setSearchTerm,
  filters,
  setFilters,
  sortBy,
  setSortBy,
  onPatientCreated,
}: FilterComponentsProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState<PatientFilters>(
    filters || { miasm: "all", bloodGroup: "all", gender: "all" }
  );
  const [tempSort, setTempSort] = useState(sortBy);

  const getActiveFilterCount = () => {
    if (!filters) return 0;
    return Object.values(filters).filter((value) => value !== "all").length;
  };

  const handleApplyFilters = () => {
    setFilters(tempFilters);
    setIsFilterOpen(false);
  };

  const handleResetFilters = () => {
    const resetFilters: PatientFilters = {
      miasm: "all",
      bloodGroup: "all",
      gender: "all",
    };
    setTempFilters(resetFilters);
    setFilters(resetFilters);
    setIsFilterOpen(false);
  };

  const handleApplySort = () => {
    setSortBy(tempSort);
    setIsSortOpen(false);
  };

  const clearFilter = (filterKey: keyof PatientFilters) => {
    const newFilters = { ...filters, [filterKey]: "all" };
    setFilters(newFilters);
    setTempFilters(newFilters);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const getMiasmLabel = (value: string) => {
    return MIASM_OPTIONS.find((opt) => opt.value === value)?.label || value;
  };

  return (
    <div className="w-full mb-1">
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
        <CardContent className="p-1 sm:p-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search by name, phone, serial number..."
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

              <Button
                variant="outline"
                onClick={() => setIsSortOpen(true)}
                className="rounded-xl border-slate-200 hover:border-[#2ab7ca] hover:bg-[#e6f7f9] transition-all duration-200"
              >
                <SortAsc className="h-4 w-4" />
                <span>Sort</span>
              </Button>
            </div>

            <div className="hidden sm:block">
              <AddPatientDialog onPatientCreated={onPatientCreated} />
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

              {filters.miasm !== "all" && (
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800 hover:bg-blue-200"
                >
                  Miasm: {getMiasmLabel(filters.miasm)}
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => clearFilter("miasm")}
                  />
                </Badge>
              )}

              {filters.bloodGroup !== "all" && (
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800 hover:bg-green-200"
                >
                  Blood: {filters.bloodGroup.toUpperCase()}
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => clearFilter("bloodGroup")}
                  />
                </Badge>
              )}

              {filters.gender !== "all" && (
                <Badge
                  variant="secondary"
                  className="bg-purple-100 text-purple-800 hover:bg-purple-200"
                >
                  Gender: {filters.gender}
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => clearFilter("gender")}
                  />
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
              Filter Patients
            </DrawerTitle>
            <DrawerDescription>
              Apply filters to find specific patients
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4 pb-4 space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Dna className="h-4 w-4" />
                Miasm Type
              </label>
              <Select
                value={tempFilters.miasm}
                onValueChange={(value) =>
                  setTempFilters({ ...tempFilters, miasm: value })
                }
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Miasms</SelectItem>
                  {MIASM_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Hash className="h-4 w-4" />
                Blood Group
              </label>
              <Select
                value={tempFilters.bloodGroup}
                onValueChange={(value) =>
                  setTempFilters({ ...tempFilters, bloodGroup: value })
                }
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Blood Groups</SelectItem>
                  {BLOOD_GROUP_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Gender
              </label>
              <Select
                value={tempFilters.gender}
                onValueChange={(value) =>
                  setTempFilters({ ...tempFilters, gender: value })
                }
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genders</SelectItem>
                  {GENDER_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

      {/* Sort Drawer */}
      <Drawer open={isSortOpen} onOpenChange={setIsSortOpen}>
        <DrawerContent className="max-h-[60vh]">
          <DrawerHeader className="pb-2">
            <DrawerTitle className="flex items-center gap-2">
              <SortAsc className="h-5 w-5" />
              Sort Patients
            </DrawerTitle>
            <DrawerDescription>
              Choose how to sort the patient list
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4 pb-4 space-y-3">
            {SORT_OPTIONS.map((option) => (
              <Button
                key={option.value}
                variant={tempSort === option.value ? "default" : "ghost"}
                onClick={() => setTempSort(option.value)}
                className={`w-full justify-start rounded-xl transition-all duration-200 ${
                  tempSort === option.value
                    ? "bg-[#2ab7ca] text-white hover:bg-[#2199aa]"
                    : "hover:bg-slate-100"
                }`}
              >
                <SortAsc className="h-4 w-4 mr-3" />
                {option.label}
                {tempSort === option.value && (
                  <Check className="h-4 w-4 ml-auto" />
                )}
              </Button>
            ))}
          </div>

          <DrawerFooter className="pt-4 border-t">
            <Button
              onClick={handleApplySort}
              className="w-full rounded-xl bg-[#2ab7ca] hover:bg-[#2199aa]"
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
