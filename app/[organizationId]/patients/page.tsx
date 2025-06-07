"use client";

import { getData } from "@/services/api";
import { useParams, useRouter } from "next/navigation";
import type React from "react";
import { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Calendar,
  Phone,
  Pill,
  ArrowRight,
  Dna,
  ActivitySquare,
  Search,
  Filter,
  Plus,
  Users,
  SortAsc,
  Grid3X3,
  List,
  TrendingUp,
  Clock,
} from "lucide-react";

import { convertKeysToCamelCase } from "@/services/caseConverters";

interface InfoItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
}

interface Patient {
  uid: string;
  serial_number: string;
  old_serial_number?: string;
  first_name?: string;
  last_name?: string;
  name: string;
  avatar?: string;
  address?: string;
  phone: string;
  relative_phone?: string;
  case_history?: string;
  presentCause?: string;
  miasm_type?: string;
  habits?: string[];
  created_at: string;
  updated_at: string;
  // effectiveness: string;
}
// Enhanced Info item component
const InfoItem = ({ icon: Icon, label, value }: InfoItemProps) => (
  <div className="flex items-center gap-3 p-1 bg-gradient-to-r from-slate-50 to-slate-100/50 rounded-lg border border-slate-200/60 hover:shadow-sm transition-all duration-200">
    <div className="flex-shrink-0 bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg shadow-sm">
      <Icon className="h-3 w-3 text-white" />
    </div>
    <div className="flex flex-col min-w-0 flex-1">
      <span className="text-slate-500 text-[11px] font-medium uppercase tracking-wide">
        {label}
      </span>
      <span className="text-slate-900 text-xs font-semibold truncate">
        {value}
      </span>
    </div>
  </div>
);

// Enhanced Patient Card Component
const PatientCard = ({ patient }: { patient: Patient }) => {
  const router = useRouter();
  const { organizationId } = useParams();
  const getEffectivenessColor = (effectiveness: string) => {
    switch (effectiveness.toLowerCase()) {
      case "excellent":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "improved":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "moderate":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  return (
    <Card className="group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 border-0 bg-white shadow-md hover:-translate-y-1 rounded-2xl overflow-hidden">
      <CardHeader className="px-2 bg-gradient-to-br from-slate-50 to-white border-b border-slate-100 [.border-b]:pb-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 font-medium text-xs px-2 py-1 rounded-full shadow-sm">
              Serial #{patient.serial_number}
            </Badge>
            <CardDescription className="text-xs text-slate-500 font-medium">
              Previous ID: {patient.old_serial_number}
            </CardDescription>
          </div>
          <Avatar className="h-12 w-12 ring-4 ring-white shadow-lg border-2 border-slate-100">
            <AvatarImage
              src={patient.avatar || "/placeholder.svg"}
              alt={patient.name}
            />
            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-lg">
              {patient.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 px-4 [.border-b]:pt-2">
        <div className="space-y-1">
          <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">
            {patient.name}
          </h3>
          <div className="flex items-center gap-2 text-slate-600">
            <div className="bg-emerald-100 p-2 rounded-lg">
              <Phone className="h-3 w-3 text-emerald-600" />
            </div>
            <span className="text-sm font-medium">{patient.phone}</span>
          </div>
        </div>

        <div className="space-y-1">
          <InfoItem
            icon={Dna}
            label="Miasm Selection"
            value={patient?.miasm_type}
          />
          <InfoItem
            icon={Pill}
            label="Medicine Date"
            value={new Date(patient.updated_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          />
          <div className="flex items-center gap-3 p-1 bg-gradient-to-r from-slate-50 to-slate-100/50 rounded-lg border border-slate-200/60">
            <div className="flex-shrink-0 bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg shadow-sm">
              <ActivitySquare className="h-3 w-3 text-white" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-slate-500 text-[11px] font-medium uppercase tracking-wide">
                Effectiveness
              </span>
              {/* <Badge
                className={`${getEffectivenessColor(
                  patient.effectiveness
                )} text-[11px] font-semibold w-fit mt-1`}
              >
                {patient.effectiveness}
              </Badge> */}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t border-slate-100 bg-slate-50/50 px-2 [.border-t]:pt-3">
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-lg">
              <Calendar className="h-3 w-3 text-orange-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] text-slate-500 font-medium">
                Last visit
              </span>
              <span className="text-xs text-slate-900 font-semibold">
                {new Date(patient.updated_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
          <Button
            onClick={() =>
              router.push(`/${organizationId}/patients/${patient.uid}`)
            }
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium transition-all duration-200 px-6 py-2.5 rounded-xl shadow-sm hover:shadow-md"
          >
            View Details
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

import { useAuth } from "@/context/AuthContext";
import {
  AddHomeoPatient,
  HomeoPatientAdditonalInformations,
} from "@/components/HomeoPatients/AddHomeopatient";

// Enhanced Add Patient Dialog Component
const AddPatientDialog = () => {
  const router = useRouter();
  const { organization } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [patientUid, setPatientUid] = useState<any>(null);

  const completeRegistration = () => {
    if (organization && patientUid) {
      router.replace(`/${organization?.uid}/patients/${patientUid}`);
    } else {
      console.error("Organization or patientUid is null");
    }
  };
  const handleNextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size={"sm"}
          className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
        >
          <Plus className="h-8 w-8" />
          Add Patient
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] rounded-2xl border-0 shadow-2xl">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-bold text-slate-900">
            Add Homeopathic Patient
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            Enter patient information to create a new record in the system.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-6">
          {currentStep === 1 && (
            <AddHomeoPatient
              onNext={handleNextStep}
              organizationId={organization?.uid}
              setPatientUid={setPatientUid}
            />
          )}
          {currentStep === 2 && (
            <HomeoPatientAdditonalInformations
              organizationId={organization?.uid}
              patientUid={patientUid}
              onComplete={completeRegistration}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Patients = () => {
  const router = useRouter();
  const { organizationId } = useParams();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMiasm, setFilterMiasm] = useState("all");
  const [filterEffectiveness, setFilterEffectiveness] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        // // Using mock data for demonstration
        // setPatients(mockPatients);
        // setFilteredPatients(mockPatients);

        console.log("organizationId", organizationId);
        // Uncomment for real API call
        const [status, response] = await getData(
          `/organization/homeopathy/${organizationId}/patients`
        );

        console.log("------status----", status);
        if (status !== 200) {
          setError("Failed to fetch patients");
          return;
        }
        console.log("------response----", response);
        // Convert keys from snake_case to camelCase
        // const convertedResponse: any = convertKeysToCamelCase(response);
        setPatients(response || []);
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
        filterMiasm === "all" ||
        patient?.miasm_type?.toLowerCase() === filterMiasm.toLowerCase();
      // const matchesEffectiveness =
      //   filterEffectiveness === "all" ||
      //   patient.effectiveness.toLowerCase() ===
      //     filterEffectiveness.toLowerCase();

      // return matchesSearch && matchesMiasm && matchesEffectiveness;
      return matchesSearch && matchesMiasm;
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
  }, [patients, searchTerm, filterMiasm, filterEffectiveness, sortBy]);

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
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 p-4 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto"></div>
            <div
              className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-r-purple-400 animate-spin mx-auto"
              style={{
                animationDirection: "reverse",
                animationDuration: "1.5s",
              }}
            ></div>
          </div>
          <div className="space-y-2">
            <p className="text-slate-700 font-semibold text-lg">
              Loading patients...
            </p>
            <p className="text-slate-500 text-sm">
              Please wait while we fetch your data
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 px-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-2">
        {/* Header */}
        <div className="text-center space-y-4 pb-2">
          <div className="">
            <h1 className="text-lg sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
              Patient Management
            </h1>
            <p className="text-slate-600 text-xs sm:text-base font-medium max-w-2xl mx-auto">
              Comprehensive patient tracking and management system
            </p>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-6">
          <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="px-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 text-sm font-medium">
                    Total Patients
                  </p>
                  <p className="text-md font-bold">{patients.length}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-xl">
                  <Users className="h-4 w-4 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="px-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-medium">
                    Improved Cases
                  </p>
                  {/* <p className="text-md font-bold">{getImprovedCount()}</p> */}
                </div>
                <div className="bg-white/20 p-3 rounded-xl">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 sm:col-span-2 lg:col-span-1">
            <CardContent className="px-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">
                    Recent Visits
                  </p>
                  <p className="text-md font-bold">
                    {getRecentPatientsCount()}
                  </p>
                </div>
                <div className="bg-white/20 p-3 rounded-xl">
                  <Clock className="h-4 w-4 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Controls */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
          <CardContent className="p-1 space-y-3">
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto lg:mx-0">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Name, phone or serial number"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-4 py-4 rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-sm bg-white shadow-sm"
              />
            </div>

            {/* Filters and Controls */}
            <div>
              {/* Filter Controls */}
              {/* <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <Select value={filterMiasm} onValueChange={setFilterMiasm}>
                  <SelectTrigger className="w-full sm:w-[160px] rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="All Miasms" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="all">All Miasms</SelectItem>
                    <SelectItem value="psora">Psora</SelectItem>
                    <SelectItem value="syphilis">Syphilis</SelectItem>
                    <SelectItem value="sycosis">Sycosis</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filterEffectiveness}
                  onValueChange={setFilterEffectiveness}
                >
                  <SelectTrigger className="w-full sm:w-[160px] rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="improved">Improved</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-[140px] rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200">
                    <SortAsc className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="recent">Recent</SelectItem>
                    <SelectItem value="serial">Serial</SelectItem>
                  </SelectContent>
                </Select>
              </div> */}

              {/* View Toggle & Add Button */}
              <div className="flex gap-4 items-center w-full lg:w-auto justify-between lg:justify-end">
                <div className="flex bg-slate-100 rounded-xl p-1">
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
                  </Button>
                </div>
                <AddPatientDialog />
              </div>
            </div>
          </CardContent>
        </Card>

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
            filterMiasm !== "all" ||
            filterEffectiveness !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setFilterMiasm("all");
                setFilterEffectiveness("all");
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
                    filterMiasm !== "all" ||
                    filterEffectiveness !== "all"
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
    </div>
  );
};

export default Patients;
