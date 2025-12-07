"use client";

import { getData } from "@/services/api";
import { useParams } from "next/navigation";
import type React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

import { Users, Eye } from "lucide-react";

import FilterComponents from "./components/FilterComponents";
import AddPatientDialog from "./components/AddPatientComponents";
import PatientCard from "./components/PatientCard";
import { Patient } from "./components/PatientCard";
import { LoadingComponent } from "@/components/LoadingComponent";
import StatCard from "./components/StatCard";

const Patients = () => {
  const { organizationId } = useParams();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    miasm: "all",
    bloodGroup: "all",
    gender: "all",
  });
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const [status, response] = await getData(
          `/organization/homeopathy/${organizationId}/patients`
        );

        if (status !== 200) {
          console.error("Failed to fetch patients");
          return;
        }
        setPatients(response.results || []);
        setFilteredPatients(response || []);
      } catch (error) {
        console.error("Failed to fetch patients:", error);
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

  if (loading) {
    return <LoadingComponent name={"Loading patients..."} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 px-4 py-2 sm:p-6 lg:p-8">
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
        <div className="grid grid-cols-2 gap-1 mb-2">
          <StatCard
            title="Total Patients"
            value={patients.length}
            icon={<Users className="w-4 h-4" />}
            color="bg-gradient-to-br from-[#205072] to-[#2d6a96]"
          />
          <StatCard
            title="Today visited"
            value={patients.length}
            icon={<Eye className="w-4 h-4" />}
            color="bg-gradient-to-br from-[#2ab7ca] to-[#4dc4d4]"
          />
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
            <button
              onClick={() => {
                setSearchTerm("");
                setFilters({
                  miasm: "all",
                  bloodGroup: "all",
                  gender: "all",
                });
              }}
              className="text-slate-500 hover:text-slate-700 text-sm"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Patient Grid/List */}
        {filteredPatients.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
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
