"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Package, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { getData } from "@/services/api";
import { HomeopathicMedicine, MedicineFilters } from "@/types/medicine.types";
import { calculateStatistics } from "@/lib/medicine.utils";
import MedicineCard from "./components/MedicineCard";
import FilterComponents from "./components/FilterComponents";
import StatCard from "./components/StatCard";

const HomeopathicMedicineList = () => {
  const { organizationId } = useParams();

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<MedicineFilters>({
    isAvailable: "all",
    expirationDate: "",
    expirationOperator: "exact",
  });
  const [sortBy, setSortBy] = useState("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [medicines, setMedicines] = useState<HomeopathicMedicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const statistics = useMemo(() => calculateStatistics(medicines), [medicines]);

  const fetchMedicines = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (filters.isAvailable !== "all")
        params.append("is_available", filters.isAvailable);
      if (filters.expirationDate) {
        const filterKey = `expiration_date__${filters.expirationOperator}`;
        params.append(filterKey, filters.expirationDate);
      }

      const ordering = sortDirection === "desc" ? `-${sortBy}` : sortBy;
      params.append("ordering", ordering);

      const queryString = params.toString();
      const [status, response] = await getData(
        `/organization/homeopathy/${organizationId}/medicines${
          queryString ? `?${queryString}` : ""
        }`
      );

      if (status !== 200) {
        throw new Error("Failed to fetch medicines");
      }

      setMedicines(response.results || []);
      setTotalCount(response.count || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching medicines:", err);
    } finally {
      setLoading(false);
    }
  }, [organizationId, searchTerm, filters, sortBy, sortDirection]);

  useEffect(() => {
    fetchMedicines();
  }, [fetchMedicines]);

  const handleApplyFilters = () => {
    fetchMedicines();
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setFilters({
      isAvailable: "all",
      expirationDate: "",
      expirationOperator: "exact",
    });
    setSortBy("created_at");
    setSortDirection("desc");
  };

  if (loading && medicines.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center rounded-3xl border border-border/60 bg-white/80 p-8 shadow-sm backdrop-blur">
          <Loader2 className="w-8 h-8 animate-spin text-[#205072] mx-auto mb-4" />
          <p className="text-muted-foreground">Loading medicines...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto rounded-3xl border border-border/60 bg-white/80 p-6 shadow-sm backdrop-blur">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            Error Loading Medicines
          </h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button
            onClick={fetchMedicines}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            title="Total"
            value={statistics.total}
            icon={<Package className="w-4 h-4" />}
            color="bg-gradient-to-br from-[#205072] to-[#2d6a96]"
          />
          <StatCard
            title="Available"
            value={statistics.available}
            icon={<CheckCircle className="w-4 h-4" />}
            color="bg-gradient-to-br from-[#2ab7ca] to-[#4dc4d4]"
          />
          <StatCard
            title="Expired"
            value={statistics.expired}
            icon={<AlertTriangle className="w-4 h-4" />}
            color="bg-gradient-to-br from-red-500 to-pink-500"
          />
        </div>

        {/* Search and Filter Section */}
        <FilterComponents
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filters={filters}
          setFilters={setFilters}
          onApplyFilters={handleApplyFilters}
          onMedicineCreated={fetchMedicines}
        />

        {/* Results Info */}
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-xs">
            Showing {medicines.length} of {totalCount} medicines
            {loading && (
              <Loader2 className="inline w-3 h-3 ml-1 animate-spin" />
            )}
          </p>
        </div>

        {/* Medicine Cards */}
        <div className="space-y-6">
          {medicines.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border/70 bg-white/70 py-12 text-center shadow-sm backdrop-blur">
              <Package className="mx-auto mb-4 h-16 w-16 text-muted-foreground/40" />
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                No medicines found
              </h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or filter criteria.
              </p>
              <button
                onClick={handleClearFilters}
                className="mt-4 text-sm font-medium text-primary hover:text-primary/80 disabled:opacity-50"
                disabled={loading}
              >
                Clear all filters
              </button>
            </div>
          ) : (
            medicines.map((medicine) => (
              <MedicineCard key={medicine.uid} medicine={medicine} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeopathicMedicineList;
