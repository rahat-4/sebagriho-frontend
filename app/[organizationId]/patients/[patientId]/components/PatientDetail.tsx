"use client";

import { getData } from "@/services/api";
import { useParams, useRouter } from "next/navigation";
import type React from "react";
import { useState, useEffect } from "react";
import {
  ChevronLeft,
  User,
  Phone,
  Home,
  BookOpen,
  FileText,
  Dna,
  Calendar,
  Pill,
  ActivitySquare,
  Heart,
  Users,
  MapPin,
  Clock,
  Edit,
  Plus,
  TrendingUp,
  Stethoscope,
  Shield,
  AlertCircle,
  Trash2,
  Venus,
  Syringe,
  Cake,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { PatientAppointment } from "../../components/Appointment";
import LoadingComponent from "@/components/LoadingComponent";
import AppointmentHistory from "./History";
// Enhanced Patient Interface
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
  gender?: string;
  age?: string;
  blood_group?: string;
  relative_phone?: string;
  case_history?: string;
  presentCause?: string;
  miasm_type?: string;
  habits?: string[];
  created_at: string;
  updated_at: string;
}

interface InfoItemProps {
  icon: React.ElementType;
  label: string;
  value: string | React.ReactNode;
  className?: string;
}

// Add these interfaces at the top of your file with other interfaces
interface Appointment {
  id: string;
  date: string;
  symptoms: string;
  treatment_effectiveness?: string;
  appointment_files?: string[];
  medicines: string[];
  status: "completed" | "upcoming" | "cancelled";
  notes?: string;
}

// Enhanced InfoItem component
const InfoItem = ({
  icon: Icon,
  label,
  value,
  className = "",
}: InfoItemProps) => (
  <div
    className={`flex justify-start items-center gap-2 p-1  rounded-xl  hover:shadow-sm transition-all duration-200 ${className}`}
  >
    <div className="flex flex-row gap-1 ">
      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-[5px] rounded-lg shadow-sm">
        <Icon className="h-3 w-3 text-white" />
      </div>
      <div className="text-slate-500 text-sm font-medium">{label}</div>
    </div>
    <div className="text-slate-900 text-sm font-semibold">{value}</div>
  </div>
);

// Timeline Item Component
const TimelineItem = ({
  date,
  title,
  description,
  isLast = false,
}: {
  date: string;
  title: string;
  description: string;
  isLast?: boolean;
}) => (
  <div className="relative">
    <div className="flex items-start gap-4">
      <div className="flex flex-col items-center">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-full shadow-sm">
          <Calendar className="h-3 w-3 text-white" />
        </div>
        {!isLast && (
          <div className="w-0.5 h-12 bg-gradient-to-b from-blue-200 to-transparent mt-2" />
        )}
      </div>
      <div className="flex-1 pb-8">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-slate-900 text-sm">{title}</h4>
            <Badge
              variant="outline"
              className="text-xs bg-blue-50 text-blue-600 border-blue-200"
            >
              {date}
            </Badge>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  </div>
);

const PatientDetail = () => {
  const router = useRouter();
  const { organizationId, patientId } = useParams();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<Appointment[] | null>(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const [status, response] = await getData(
          `/organization/homeopathy/${organizationId}/patients/${patientId}`
        );

        if (status !== 200) {
          setError("Failed to fetch patient details");
          return;
        }

        setPatient(response);
      } catch (error: any) {
        setError(error.message || "Failed to fetch patient details");
      } finally {
        setLoading(false);
      }
    };

    if (organizationId && patientId) {
      fetchPatient();
    }
  }, [organizationId, patientId]);

  if (loading) {
    return <LoadingComponent name="Loading Patient Details..." />;
  }

  if (error || !patient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-0 shadow-xl rounded-2xl">
          <CardContent className="p-8 text-center">
            <div className="bg-red-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Error Loading Patient
            </h3>
            <p className="text-slate-600 mb-6">
              {error || "Patient not found"}
            </p>
            <Button
              onClick={() => router.back()}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  console.log("Patient Data:", patient);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Enhanced Back Button */}
        <Button
          variant="ghost"
          size="sm"
          className="mb-2 hover:bg-slate-100 transition-colors duration-200"
          onClick={() => router.back()}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Patients
        </Button>

        {/* Enhanced Patient Header */}
        <div className="bg-white rounded-2xl border-0 shadow-lg px-6 pb-4 pt-2 mb-2 hover:shadow-xl transition-all duration-300">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2">
            <div className="flex flex-row justify-between items-center gap-4 w-full lg:w-auto">
              <Avatar className="h-20 w-20 lg:h-24 lg:w-24 ring-4 ring-white shadow-xl border-4 border-slate-100">
                <AvatarImage
                  src={patient.avatar || "/placeholder.svg"}
                  alt={patient.name}
                />
                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-xl">
                  {/* {getInitials(patient.name)} */}
                  {patient.name}
                </AvatarFallback>
              </Avatar>
              <div className="grid grid-cols-1 md:grid-cols-3">
                <Card className="p-2 gap-2 bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200 shadow-sm hover:shadow-md transition-all duration-200">
                  <CardContent className="px-1">
                    <div className="flex flex-col items-center">
                      <div className="bg-gradient-to-br from-purple-500 to-violet-600 p-2 rounded-lg">
                        <Calendar className="h-3 w-3 text-white" />
                      </div>
                      <p className="text-xs font-medium text-purple-600">
                        Total visited
                      </p>
                      <p className="text-sm font-bold text-purple-800">0</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="flex-1 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {patient.name}
                </h1>
                <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 font-medium px-3 py-1 rounded-full shadow-sm w-fit">
                  Serial #{patient.serial_number}
                </Badge>
              </div>

              <p className="text-slate-500 text-sm font-medium">
                Old Serial Number: {patient.old_serial_number}
              </p>

              <div className="flex flex-wrap items-center gap-1 text-sm">
                <div className="flex items-center gap-1 text-slate-600">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span>Created: {formatDate(patient.created_at)}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-600">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span>Last updated: {formatDate(patient.updated_at)}</span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-1 w-full lg:w-auto pt-2">
              <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium px-6 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                <Edit className="h-4 w-4 mr-2" />
                Edit Patient
              </Button>
              <Button
                variant="outline"
                className="border-red-200 bg-red-600 text-white hover:bg-red-50 font-medium px-6 py-2.5 rounded-xl transition-all duration-200"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Patient
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <div className="bg-white rounded-2xl border-0 shadow-lg p-1">
            <TabsList className="w-full max-w-2xl mx-auto grid grid-cols-3 bg-slate-50 rounded-xl p-1">
              <TabsTrigger
                value="overview"
                className="rounded-lg font-medium transition-all duration-200 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-indigo-600"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="medical"
                className="rounded-lg font-medium transition-all duration-200 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-indigo-600"
              >
                Medical
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="rounded-lg font-medium transition-all duration-200 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-indigo-600"
              >
                History
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Contact Information */}
              <Card className="gap-2 px-0 py-3 bg-white border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-3">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg">
                      <Users className="h-3 w-3 text-white" />
                    </div>
                    General Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <InfoItem
                    icon={Phone}
                    label="Primary Phone: "
                    value={patient.phone}
                  />
                  <InfoItem
                    icon={Venus}
                    label="Gender: "
                    value={patient.gender}
                  />
                  <InfoItem icon={Venus} label="Age: " value={patient.age} />
                  <InfoItem
                    icon={Syringe}
                    label="Blood Group: "
                    value={patient.blood_group}
                  />
                  <InfoItem
                    icon={Users}
                    label="Emergency Contact: "
                    value={patient.relative_phone}
                  />
                  <InfoItem
                    icon={MapPin}
                    label="Address: "
                    value={patient.address}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Medical Tab */}
          <TabsContent value="medical" className="space-y-1">
            {/* Treatment Analysis */}
            <Card className="bg-white border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300">
              {/* <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-3">
                  Treatment Analysis
                </CardTitle>
              </CardHeader> */}
              <CardContent>
                {patient.miasm_type && (
                  <div className="flex justify-center font-semibold items-center gap-1">
                    <div className="bg-gradient-to-br from-purple-500 to-violet-600 p-1 rounded-lg">
                      <Dna className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm text-purple-600 font-medium">
                      Miasm Type:
                    </span>
                    <Badge className="bg-purple-100 text-purple-800 border-purple-200 p-[5px]">
                      {patient.miasm_type}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
            {/* Patient Habits */}
            <Card className="gap-3 p-2 bg-white border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300">
              <CardHeader className="gap-0">
                <CardTitle className="text-md font-bold text-slate-900 flex items-center justify-center gap-2">
                  <div className="bg-gradient-to-br from-orange-500 to-red-500 p-[5px] rounded-lg">
                    <Heart className="h-3 w-3 text-white" />
                  </div>
                  Patient Habits
                </CardTitle>
              </CardHeader>
              <CardContent className="px-2">
                <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 rounded-xl p-3 border border-slate-200/60">
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {patient.habits}
                  </p>
                </div>
              </CardContent>
            </Card>
            {/* Case History */}

            <Card className="gap-3 p-2 bg-white border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300">
              <CardHeader className="gap-0">
                <CardTitle className="text-md font-bold text-slate-900 flex items-center justify-center gap-2">
                  <div className="bg-gradient-to-br from-red-500 to-pink-600 p-[5px] rounded-lg">
                    <AlertCircle className="h-3 w-3 text-white" />
                  </div>
                  Case History
                </CardTitle>
              </CardHeader>
              <CardContent className="px-2">
                <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 rounded-xl p-3 border border-slate-200/60">
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {patient.case_history}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            {/* Appointment Statistics */}
            <AppointmentHistory appointments={appointments} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Enhanced Floating Action Button */}
      {/* <div className="fixed bottom-6 right-6 flex flex-col gap-3">
        <PatientAppointment
          organizationId={organizationId}
          patientId={patientId}
        />
      </div> */}
    </div>
  );
};

export default PatientDetail;
