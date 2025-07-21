"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useParams } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { Package, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";

import { getData } from "@/services/api";

import { HomeopathicMedicine } from "./components/medicineinterface";
import MedicineCard from "./components/MedicineCard";

import AddHomeopathicMedicine from "./components/AddMedicine";

import FilterComponents from "./components/FilterComponents";

// Updated filter interface to match the backend
interface Filters {
  isAvailable: string;
  expirationDate: string;
  expirationOperator: string;
}

const HomeopathicMedicineList: React.FC = () => {
  const { organizationId } = useParams();
  // Filter states aligned with backend
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Filters>({
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

  // Utility functions for expiration status
  const isExpired = (date: string): boolean => {
    return new Date(date) < new Date();
  };

  const isExpiringSoon = (date: string): boolean => {
    const expirationDate = new Date(date);
    const today = new Date();
    const thirtyDaysFromNow = new Date(
      today.getTime() + 30 * 24 * 60 * 60 * 1000
    );
    return expirationDate <= thirtyDaysFromNow && expirationDate >= today;
  };

  // Fetch medicines from API
  const fetchMedicines = async () => {
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

      const [status, response] = await getData(
        `/organization/homeopathy/${organizationId}/medicines`
      );

      if (status !== 200) {
        setError("Failed to fetch patients");
        return;
      }

      setMedicines(response.results);
      setTotalCount(response.count);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching medicines"
      );
      console.error("Error fetching medicines:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchMedicines();
  }, []);

  // Statistics calculations
  const statistics = useMemo(() => {
    const total = medicines.length;
    const available = medicines.filter((med) => med.is_available).length;
    const expired = medicines.filter((med) =>
      isExpired(med.expiration_date)
    ).length;
    const expiringSoon = medicines.filter(
      (med) =>
        isExpiringSoon(med.expiration_date) && !isExpired(med.expiration_date)
    ).length;

    return { total, available, expired, expiringSoon };
  }, [medicines]);

  // Apply filters and sorting
  const handleApplyFilters = async () => {
    await fetchMedicines();
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm("");
    setFilters({
      isAvailable: "all",
      expirationDate: "",
      expirationOperator: "exact",
    });
    setSortBy("created_at");
    setSortDirection("desc");
  };

  // Clear filters and refetch
  const handleClearFilters = async () => {
    clearAllFilters();
    // Use timeout to ensure state is updated before fetching
    setTimeout(() => {
      fetchMedicines();
    }, 0);
  };

  const StatCard: React.FC<{
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, icon, color }) => (
    <Card
      className={`p-2 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${color}`}
    >
      <CardContent className="px-1">
        <div className="flex flex-col items-center">
          <div className="bg-white/20 p-1 rounded-xl">{icon}</div>
          <div>
            <p className="text-indigo-100 text-xs font-medium">{title}</p>
            <p className="text-sm text-center font-bold">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading && medicines.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading medicines...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Error Loading Medicines
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchMedicines}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-2 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Statistics Cards */}
        <div className="grid grid-cols-3 gap-1 mb-2">
          <StatCard
            title="Total"
            value={statistics.total}
            icon={<Package className="w-4 h-4" />}
            color="bg-gradient-to-br from-indigo-500 to-purple-600"
          />
          <StatCard
            title="Available"
            value={statistics.available}
            icon={<CheckCircle className="w-4 h-4" />}
            color="bg-gradient-to-br from-emerald-500 to-teal-600"
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
        />

        {/* Results Info */}
        <div className="flex items-center justify-between mb-2">
          <p className="text-gray-600 text-xs">
            Showing {medicines.length} of {totalCount} medicines
            {loading && (
              <Loader2 className="inline w-3 h-3 ml-1 animate-spin" />
            )}
          </p>
        </div>

        {/* Medicine Cards */}
        <div className="space-y-6">
          {medicines.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No medicines found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or filter criteria
              </p>
              <button
                onClick={handleClearFilters}
                className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
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
