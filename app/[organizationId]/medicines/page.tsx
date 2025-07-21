"use client";

import React, { useState, useMemo } from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  Filter,
  Calendar,
  Package,
  DollarSign,
  Building2,
  Hash,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";

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

// Mock data - replace with your API call
const mockMedicines: HomeopathicMedicine[] = [
  {
    uid: "1",
    avatar: "",
    name: "Arnica Montana",
    power: "30C",
    expiration_date: "2025-12-31",
    is_available: true,
    manufacturer: "Boiron",
    total_quantity: 100,
    unit_price: 12.99,
    description: "Used for bruises, muscle soreness, and trauma",
    batch_number: "BT001",
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-06-15T14:20:00Z",
  },
  {
    uid: "2",
    avatar: "",
    name: "Belladonna",
    power: "200C",
    expiration_date: "2024-12-01",
    is_available: false,
    manufacturer: "Heel",
    total_quantity: 0,
    unit_price: 15.5,
    description: "For fever, inflammation, and sudden onset symptoms",
    batch_number: "BT002",
    created_at: "2024-02-10T08:15:00Z",
    updated_at: "2024-06-20T16:45:00Z",
  },
  {
    uid: "3",
    avatar: "",
    name: "Nux Vomica",
    power: "6X",
    expiration_date: "2026-03-15",
    is_available: true,
    manufacturer: "Boiron",
    total_quantity: 75,
    unit_price: 11.25,
    description: "For digestive issues and stress-related symptoms",
    batch_number: "BT003",
    created_at: "2024-03-05T12:00:00Z",
    updated_at: "2024-06-25T09:30:00Z",
  },
  {
    uid: "4",
    avatar: "",
    name: "Calendula",
    power: "1X",
    expiration_date: "2024-08-30",
    is_available: true,
    manufacturer: "Hyland's",
    total_quantity: 50,
    unit_price: 9.99,
    description: "For wound healing and skin conditions",
    batch_number: "BT004",
    created_at: "2024-01-20T15:45:00Z",
    updated_at: "2024-06-10T11:15:00Z",
  },
  {
    uid: "5",
    avatar: "",
    name: "Rhus Toxicodendron",
    power: "30C",
    expiration_date: "2025-06-20",
    is_available: true,
    manufacturer: "Heel",
    total_quantity: 120,
    unit_price: 13.75,
    description: "For joint stiffness and skin eruptions",
    batch_number: "BT005",
    created_at: "2024-02-28T13:20:00Z",
    updated_at: "2024-06-30T10:10:00Z",
  },
  {
    uid: "6",
    avatar: "",
    name: "Bryonia Alba",
    power: "30C",
    expiration_date: "2024-07-25",
    is_available: true,
    manufacturer: "Boiron",
    total_quantity: 30,
    unit_price: 14.0,
    description: "For dry cough and joint pain",
    batch_number: "BT006",
    created_at: "2024-04-10T09:30:00Z",
    updated_at: "2024-07-01T14:00:00Z",
  },
];

const HomeopathicMedicineList: React.FC = () => {
  // Filter states aligned with backend
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Filters>({
    isAvailable: "all",
    expirationDate: "",
    expirationOperator: "exact",
  });
  const [sortBy, setSortBy] = useState("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const [medicines] = useState<HomeopathicMedicine[]>(mockMedicines);

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

  // Apply filters and sorting (mimicking backend behavior)
  const filteredAndSortedMedicines = useMemo(() => {
    let filtered = medicines.filter((medicine) => {
      // Search filter (name or manufacturer)
      const matchesSearch =
        searchTerm === "" ||
        medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        medicine.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());

      // Availability filter
      const matchesAvailability =
        filters.isAvailable === "all" ||
        (filters.isAvailable === "true" && medicine.is_available) ||
        (filters.isAvailable === "false" && !medicine.is_available);

      // Expiration date filter
      let matchesExpiration = true;
      if (filters.expirationDate) {
        const medicineDate = new Date(medicine.expiration_date);
        const filterDate = new Date(filters.expirationDate);

        switch (filters.expirationOperator) {
          case "exact":
            matchesExpiration =
              medicineDate.toDateString() === filterDate.toDateString();
            break;
          case "gt":
            matchesExpiration = medicineDate > filterDate;
            break;
          case "lt":
            matchesExpiration = medicineDate < filterDate;
            break;
          default:
            matchesExpiration = true;
        }
      }

      return matchesSearch && matchesAvailability && matchesExpiration;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "manufacturer":
          aValue = a.manufacturer.toLowerCase();
          bValue = b.manufacturer.toLowerCase();
          break;
        case "expiration_date":
          aValue = new Date(a.expiration_date);
          bValue = new Date(b.expiration_date);
          break;
        case "created_at":
        default:
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
          break;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [medicines, searchTerm, filters, sortBy, sortDirection]);

  // This would be your API call function
  const handleApplyFilters = async () => {
    // In a real app, this would make an API call to your Django backend
    // const params = new URLSearchParams();

    // if (searchTerm) params.append('search', searchTerm);
    // if (filters.isAvailable !== 'all') params.append('is_available', filters.isAvailable);
    // if (filters.expirationDate) {
    //   const filterKey = `expiration_date__${filters.expirationOperator}`;
    //   params.append(filterKey, filters.expirationDate);
    // }

    // const ordering = sortDirection === 'desc' ? `-${sortBy}` : sortBy;
    // params.append('ordering', ordering);

    // const response = await fetch(`/api/medicines/?${params.toString()}`);
    // const data = await response.json();
    // setMedicines(data.results);

    console.log("Filters applied:", {
      searchTerm,
      filters,
      sortBy,
      sortDirection,
    });
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

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-2 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Statistics Cards */}
        <div className="grid grid-cols-4 gap-1 mb-4">
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
          <StatCard
            title="Expiring Soon"
            value={statistics.expiringSoon}
            icon={<Clock className="w-4 h-4" />}
            color="bg-gradient-to-br from-orange-500 to-yellow-500"
          />
        </div>

        {/* Search and Filter Section */}
        <FilterComponents
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filters={filters}
          setFilters={setFilters}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortDirection={sortDirection}
          setSortDirection={setSortDirection}
          onApplyFilters={handleApplyFilters}
        />

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing {filteredAndSortedMedicines.length} of {medicines.length}{" "}
            medicines
          </p>
        </div>

        {/* Medicine Cards */}
        <div className="space-y-6">
          {filteredAndSortedMedicines.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No medicines found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or filter criteria
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilters({
                    isAvailable: "all",
                    expirationDate: "",
                    expirationOperator: "exact",
                  });
                  setSortBy("created_at");
                  setSortDirection("desc");
                }}
                className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            filteredAndSortedMedicines.map((medicine) => (
              <MedicineCard key={medicine.uid} medicine={medicine} />
            ))
          )}
        </div>
      </div>

      {/* Fixed Add Button */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 md:hidden">
        <AddHomeopathicMedicine />
      </div>
    </div>
  );
};

export default HomeopathicMedicineList;
