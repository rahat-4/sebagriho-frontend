"use client";

import { getData } from "@/services/api";
import { useParams, useRouter } from "next/navigation";
import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { Users, TrendingUp, Eye } from "lucide-react";

import FilterComponents from "./components/FilterComponents";
import AddPatientDialog from "./components/AddPatientComponents";
import PatientCard from "./components/PatientCard";
import { Patient } from "./components/PatientCard";
import { LoadingComponent } from "@/components/LoadingComponent";

const Patients = () => {
  const router = useRouter();
  const { organizationId } = useParams();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    miasm: "all",
    bloodGroup: "all",
    gender: "all",
  });
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const [status, response] = await getData(
          `/organization/homeopathy/${organizationId}/patients`
        );

        if (status !== 200) {
          setError("Failed to fetch patients");
          return;
        }
        setPatients(response.results || []);
        setFilteredPatients(response || []);
      } catch (error: any) {
        setError(error.message || "Failed to fetch patients");
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [organizationId]);

  // Filter and search logic
  useEffect(() => {
    const filtered = patients.filter((patient) => {
      const matchesSearch =
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone.includes(searchTerm);
      const matchesMiasm =
        filters.miasm === "all" ||
        patient?.miasm_type?.toLowerCase() === filters.miasm.toLowerCase();
      const matchesBloodGroup =
        filters.bloodGroup === "all" ||
        patient?.blood_group === filters.bloodGroup;

      return matchesSearch && matchesMiasm && matchesBloodGroup;
    });

    // Sort patients
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "recent":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case "serial":
          return (
            Number.parseInt(a.serial_number) - Number.parseInt(b.serial_number)
          );
        default:
          return 0;
      }
    });

    setFilteredPatients(filtered);
  }, [patients, searchTerm, filters, sortBy]);

  // const getImprovedCount = () => {
  //   return patients.filter(
  //     (p) => p.effectiveness === "Improved" || p.effectiveness === "Excellent"
  //   ).length;
  // };

  const getRecentPatientsCount = () => {
    return patients.filter(
      (p) => p.updated_at.includes("day") || p.updated_at.includes("week")
    ).length;
  };

  if (loading) {
    return <LoadingComponent name={"Loading patients..."} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 px-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-2">
        {/* Header */}
        {/* <div className="text-center space-y-4 pb-2">
          <div className="">
            <h1 className="text-lg sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
              Patient Management
            </h1>
            <p className="text-slate-600 text-xs sm:text-base font-medium max-w-2xl mx-auto">
              Comprehensive patient tracking and management system
            </p>
          </div>
        </div> */}

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-2 gap-2">
          <Card className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="px-1">
              <div className="flex flex-col items-center ">
                <div className="bg-white/20 p-1 rounded-xl">
                  <Users className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-indigo-100 text-sm font-medium">
                    Total Patients
                  </p>
                  <p className="text-md text-center font-bold">
                    {patients.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="px-1">
              <div className="flex flex-col items-center ">
                <div className="bg-white/20 p-1 rounded-xl">
                  <Eye className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-emerald-100 text-sm font-medium">
                    Today visited
                  </p>
                  <p className="text-md text-center font-bold">4</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Controls */}
        <FilterComponents
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filters={filters}
          setFilters={setFilters}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        {/* Results Count */}
        <div className="flex justify-between items-center px-1">
          <p className="text-slate-600 font-medium text-sm">
            Showing{" "}
            <span className="font-bold text-slate-900">
              {filteredPatients.length}
            </span>{" "}
            of{" "}
            <span className="font-bold text-slate-900">{patients.length}</span>{" "}
            patients
          </p>
          {(searchTerm ||
            filters.miasm !== "all" ||
            filters.bloodGroup !== "all" ||
            filters.gender !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setFilters({
                  miasm: "all",
                  bloodGroup: "all",
                  gender: "all",
                });
              }}
              className="text-slate-500 hover:text-slate-700"
            >
              Clear filters
            </Button>
          )}
        </div>

        {/* Patient Grid/List */}
        {filteredPatients.length > 0 ? (
          <div
            className={`grid gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
                : "grid-cols-1 max-w-5xl mx-auto"
            }`}
          >
            {filteredPatients.map((patient) => (
              <PatientCard key={patient.uid} patient={patient} />
            ))}
          </div>
        ) : (
          <Card className="border-0 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50 shadow-lg">
            <CardContent className="p-12 text-center">
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-slate-200 to-slate-300 rounded-full p-6 w-24 h-24 mx-auto flex items-center justify-center">
                  <Users className="h-12 w-12 text-slate-500" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-slate-800">
                    No Patients Found
                  </h3>
                  <p className="text-slate-600 max-w-md mx-auto leading-relaxed">
                    {searchTerm ||
                    filters.miasm !== "all" ||
                    filters.bloodGroup !== "all" ||
                    filters.gender !== "all"
                      ? "No patients match your current search criteria. Try adjusting your filters or search terms."
                      : "You haven't added any patients yet. Get started by adding your first patient to the system."}
                  </p>
                </div>
                <div className="pt-4">
                  <AddPatientDialog />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="fixed bottom-6 right-6 flex flex-col gap-3 md:hidden">
        <AddPatientDialog />
      </div>
    </div>
  );
};

export default Patients;
