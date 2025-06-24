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
  Users,
  Hash,
  X,
  Check,
} from "lucide-react";

// Types
interface Filters {
  miasm: string;
  bloodGroup: string;
  gender: string;
}

interface SortOption {
  value: string;
  label: string;
}

// Mock compone

interface FilterComponentsProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterMiasm: string;
  setFilterMiasm: (miasm: string) => void;
  AddPatientDialog: React.ComponentType;
}

const FilterComponents = ({
  searchTerm,
  setSearchTerm,
  filterMiasm,
  setFilterMiasm,
  AddPatientDialog,
}: FilterComponentsProps) => {
  //   const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filter states
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Filters>({
    miasm: "all",
    bloodGroup: "all",
    gender: "all",
  });
  const [tempFilters, setTempFilters] = useState<Filters>(activeFilters);

  // Sort states
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [activeSort, setActiveSort] = useState("name");
  const [tempSort, setTempSort] = useState(activeSort);

  const sortOptions: SortOption[] = [
    { value: "name", label: "Name (A-Z)" },
    { value: "lastVisit", label: "Last Visit (Recent)" },
  ];

  // Get active filter count
  const getActiveFilterCount = () => {
    return Object.values(activeFilters).filter((value) => value !== "all")
      .length;
  };

  // Handle filter apply
  const handleApplyFilters = () => {
    setActiveFilters(tempFilters);
    setIsFilterOpen(false);
  };

  // Handle filter reset
  const handleResetFilters = () => {
    const resetFilters = { miasm: "all", bloodGroup: "all", gender: "all" };
    setTempFilters(resetFilters);
    setActiveFilters(resetFilters);
    setIsFilterOpen(false);
  };

  // Handle sort apply
  const handleApplySort = () => {
    setActiveSort(tempSort);
    setIsSortOpen(false);
  };

  // Clear individual filter
  const clearFilter = (filterKey: keyof Filters) => {
    const newFilters = { ...activeFilters, [filterKey]: "all" };
    setActiveFilters(newFilters);
    setTempFilters(newFilters);
  };

  // Get search placeholder based on screen size
  const getSearchPlaceholder = () => {
    if (typeof window !== "undefined" && window.innerWidth < 640) {
      return "Search patients...";
    }
    return "Name, phone, serial number, old serial number...";
  };

  return (
    <div className="w-full">
      {/* Main Controls */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
        <CardContent className="p-1 sm:p-6 space-y-1">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder={getSearchPlaceholder()}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/50 text-sm bg-white shadow-sm transition-all duration-200"
            />
          </div>

          {/* Action Buttons Row */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
            {/* Right Side Controls */}
            <div className="flex gap-3 items-center justify-between sm:justify-end">
              {/* View Toggle */}
              <div className="hidden sm:flex bg-slate-100 rounded-xl p-1 ">
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
            {/* Add Patient Button */}
            <div className="hidden sm:block">
              <AddPatientDialog />
            </div>
            <div className="flex flex-row">
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
                  <SortAsc className="h-4 w-4" />
                  <span>Sort</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {(searchTerm || getActiveFilterCount() > 0) && (
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
                    onClick={() => setSearchTerm("")}
                  />
                </Badge>
              )}

              {activeFilters.miasm !== "all" && (
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800 hover:bg-blue-200"
                >
                  Miasm: {activeFilters.miasm}
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => clearFilter("miasm")}
                  />
                </Badge>
              )}

              {activeFilters.bloodGroup !== "all" && (
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800 hover:bg-green-200"
                >
                  Blood: {activeFilters.bloodGroup.toUpperCase()}
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => clearFilter("bloodGroup")}
                  />
                </Badge>
              )}

              {activeFilters.gender !== "all" && (
                <Badge
                  variant="secondary"
                  className="bg-purple-100 text-purple-800 hover:bg-purple-200"
                >
                  Gender: {activeFilters.gender}
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => clearFilter("gender")}
                  />
                </Badge>
              )}

              {activeSort !== "name" && (
                <Badge
                  variant="secondary"
                  className="bg-orange-100 text-orange-800 hover:bg-orange-200"
                >
                  Sort:{" "}
                  {sortOptions.find((opt) => opt.value === activeSort)?.label}
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
            {/* Miasm Filter */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Miasm
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
                  <SelectItem value="psora">Psora</SelectItem>
                  <SelectItem value="syphilis">Syphilis</SelectItem>
                  <SelectItem value="sycosis">Sycosis</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Blood Group Filter */}
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
                  <SelectItem value="a+">A+</SelectItem>
                  <SelectItem value="a-">A-</SelectItem>
                  <SelectItem value="b+">B+</SelectItem>
                  <SelectItem value="b-">B-</SelectItem>
                  <SelectItem value="ab+">AB+</SelectItem>
                  <SelectItem value="ab-">AB-</SelectItem>
                  <SelectItem value="o+">O+</SelectItem>
                  <SelectItem value="o-">O-</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Gender Filter */}
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
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
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
            {sortOptions.map((option) => (
              <Button
                key={option.value}
                variant={tempSort === option.value ? "default" : "ghost"}
                onClick={() => setTempSort(option.value)}
                className={`w-full justify-start rounded-xl transition-all duration-200 ${
                  tempSort === option.value
                    ? "bg-indigo-500 text-white hover:bg-indigo-600"
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
