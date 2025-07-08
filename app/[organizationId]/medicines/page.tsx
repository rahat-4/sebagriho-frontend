// "use client";

// import LoadingComponent from "@/components/LoadingComponent";

// import { useAuth } from "@/context/AuthContext";

// import { useState, useEffect } from "react";

// import { useRouter } from "next/navigation";

// import { Button } from "@/components/ui/button";

// import { PlusCircle } from "lucide-react";

// import CardComponents from "@/components/CardComponents";
// import DataTable from "@/components/Organizations/DataTable/DataTable";

// import { medicineStats } from "@/payload/Organization";
// import { getData } from "@/services/api";

// const Medicines = () => {
//   const { isAuthenticated, user, organization, isLoading } = useAuth();
//   const router = useRouter();
//   const [tableData, setTableData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (
//       !isLoading &&
//       (!isAuthenticated || organization === null || user?.is_owner !== true)
//     ) {
//       router.replace("/login"); // Replace this later
//     }
//   }, [isAuthenticated, isLoading, user, router]);

//   useEffect(() => {
//     const fetchMedicines = async () => {
//       try {
//         const [status, response] = await getData(
//           `/organization/homeopathy/${organization?.uid}/medicines`
//         );

//         console.log("------status----", status);
//         console.log("------response----", response);

//         if (status !== 200) {
//           setError("Failed to fetch medicines");
//           return;
//         }
//         setTableData(response);
//       } catch (error: any) {
//         setError(error.message || "Failed to fetch medicines");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMedicines();
//   }, []);

//   if (isLoading) return <LoadingComponent name={"Loading medicines..."} />;
//   if (!isAuthenticated || user?.is_owner !== true) return null;

//   return (
//     <div className="container mx-auto p-2">
//       <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
//         {medicineStats.map((stat) => (
//           <CardComponents key={stat.title} {...stat} />
//         ))}
//       </div>

//       <div className="">
//         <div className="flex items-center justify-between my-4">
//           <h2 className="text-2xl font-bold">Medicines List</h2>
//           <Button
//             className="h-9 text-sm cursor-pointer"
//             onClick={() => router.push(`/${organization?.uid}/medicines/add`)}
//           >
//             Add Medicine <PlusCircle />
//           </Button>
//         </div>
//         {/* Loading state */}
//         {loading && <LoadingComponent name={"Loading medicines..."} />}

//         {/* Error state */}
//         {error && <p className="text-red-500">{error}</p>}

//         {/* Table */}
//         {/* <DataTable data={tableData} /> */}

//         {/* Empty state */}
//         {!loading && !error && tableData.length === 0 && (
//           <p>No medicines found.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Medicines;

"use client";

import React, { useState, useMemo } from "react";
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

interface FilterState {
  search: string;
  availability: "all" | "available" | "unavailable";
  expirationFilter: "all" | "expired" | "expiring_soon" | "valid";
  manufacturer: string;
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
    created_at: "2024-01-15",
    updated_at: "2024-06-15",
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
    created_at: "2024-02-10",
    updated_at: "2024-06-20",
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
    created_at: "2024-03-05",
    updated_at: "2024-06-25",
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
    created_at: "2024-01-20",
    updated_at: "2024-06-10",
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
    created_at: "2024-02-28",
    updated_at: "2024-06-30",
  },
];

const HomeopathicMedicineList: React.FC = () => {
  const [medicines] = useState<HomeopathicMedicine[]>(mockMedicines);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    availability: "all",
    expirationFilter: "all",
    manufacturer: "",
  });
  const [showFilters, setShowFilters] = useState(false);

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

  const getExpirationStatus = (date: string) => {
    if (isExpired(date)) return "expired";
    if (isExpiringSoon(date)) return "expiring_soon";
    return "valid";
  };

  // Statistics calculations
  const statistics = useMemo(() => {
    const total = medicines.length;
    const available = medicines.filter((med) => med.is_available).length;
    const expired = medicines.filter((med) =>
      isExpired(med.expiration_date)
    ).length;

    return { total, available, expired };
  }, [medicines]);

  // Filtered medicines
  const filteredMedicines = useMemo(() => {
    return medicines.filter((medicine) => {
      // Search filter
      const matchesSearch =
        filters.search === "" ||
        medicine.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        medicine.manufacturer
          .toLowerCase()
          .includes(filters.search.toLowerCase());

      // Availability filter
      const matchesAvailability =
        filters.availability === "all" ||
        (filters.availability === "available" && medicine.is_available) ||
        (filters.availability === "unavailable" && !medicine.is_available);

      // Expiration filter
      const expirationStatus = getExpirationStatus(medicine.expiration_date);
      const matchesExpiration =
        filters.expirationFilter === "all" ||
        filters.expirationFilter === expirationStatus;

      // Manufacturer filter
      const matchesManufacturer =
        filters.manufacturer === "" ||
        medicine.manufacturer === filters.manufacturer;

      return (
        matchesSearch &&
        matchesAvailability &&
        matchesExpiration &&
        matchesManufacturer
      );
    });
  }, [medicines, filters]);

  const uniqueManufacturers = useMemo(() => {
    return Array.from(new Set(medicines.map((med) => med.manufacturer))).sort();
  }, [medicines]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      availability: "all",
      expirationFilter: "all",
      manufacturer: "",
    });
  };

  const StatCard: React.FC<{
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, icon, color }) => (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-2 ${color}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className="p-3 rounded-full bg-opacity-10">{icon}</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-2 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
          <StatCard
            title="Total Medicines"
            value={statistics.total}
            icon={<Package className="w-5 h-5 text-blue-600" />}
            color="hover:bg-blue-50"
          />
          <StatCard
            title="Available Medicines"
            value={statistics.available}
            icon={<CheckCircle className="w-5 h-5 text-green-600" />}
            color="hover:bg-green-50"
          />
          <StatCard
            title="Expired Medicines"
            value={statistics.expired}
            icon={<AlertTriangle className="w-5 h-5 text-red-600" />}
            color="hover:bg-red-50"
          />
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-2">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search medicines or manufacturers..."
                  className="text-xs w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="text-sm inline-flex items-center px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
              {/* Availability Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Availability
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  value={filters.availability}
                  onChange={(e) =>
                    handleFilterChange("availability", e.target.value)
                  }
                >
                  <option value="all">All</option>
                  <option value="available">Available</option>
                  <option value="unavailable">Out of Stock</option>
                </select>
              </div>

              {/* Expiration Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiration Status
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  value={filters.expirationFilter}
                  onChange={(e) =>
                    handleFilterChange("expirationFilter", e.target.value)
                  }
                >
                  <option value="all">All</option>
                  <option value="valid">Valid</option>
                  <option value="expiring_soon">Expiring Soon</option>
                  <option value="expired">Expired</option>
                </select>
              </div>

              {/* Manufacturer Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Manufacturer
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  value={filters.manufacturer}
                  onChange={(e) =>
                    handleFilterChange("manufacturer", e.target.value)
                  }
                >
                  <option value="">All Manufacturers</option>
                  {uniqueManufacturers.map((manufacturer) => (
                    <option key={manufacturer} value={manufacturer}>
                      {manufacturer}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reset Filters */}
              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing {filteredMedicines.length} of {medicines.length} medicines
          </p>
        </div>

        {/* Medicine Cards */}
        <div className="space-y-6">
          {filteredMedicines.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No medicines found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            filteredMedicines.map((medicine) => (
              <MedicineCard key={medicine.uid} medicine={medicine} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeopathicMedicineList;
