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

// Enhanced InfoItem component
const InfoItem = ({
  icon: Icon,
  label,
  value,
  className = "",
}: InfoItemProps) => (
  <div
    className={`flex items-start gap-4 p-4 bg-gradient-to-r from-slate-50 to-slate-100/50 rounded-xl border border-slate-200/60 hover:shadow-sm transition-all duration-200 ${className}`}
  >
    <div className="flex-shrink-0 bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 rounded-lg shadow-sm">
      <Icon className="h-4 w-4 text-white" />
    </div>
    <div className="flex flex-col min-w-0 flex-1">
      <span className="text-slate-500 text-xs font-medium uppercase tracking-wide mb-1">
        {label}
      </span>
      <div className="text-slate-900 text-sm font-semibold">{value}</div>
    </div>
  </div>
);

// Quick Stats Card Component
const QuickStatsCard = ({
  icon: Icon,
  label,
  value,
  color = "blue",
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color?: string;
}) => {
  const colorClasses = {
    blue: "from-blue-500 to-indigo-600",
    green: "from-emerald-500 to-teal-600",
    purple: "from-purple-500 to-violet-600",
    orange: "from-orange-500 to-red-500",
  };

  return (
    <Card className="bg-gradient-to-br bg-white border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 rounded-xl">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">
              {label}
            </p>
            <p className="text-slate-900 text-lg font-bold mt-1">{value}</p>
          </div>
          <div
            className={`bg-gradient-to-br ${
              colorClasses[color as keyof typeof colorClasses]
            } p-3 rounded-xl shadow-sm`}
          >
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

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
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 flex items-center justify-center">
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
              Loading patient details...
            </p>
            <p className="text-slate-500 text-sm">
              Please wait while we fetch the information
            </p>
          </div>
        </div>
      </div>
    );
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

  // const getInitials = (name: string) => {
  //   return name
  //     .split(" ")
  //     .map((n) => n[0])
  //     .join("")
  //     .toUpperCase();
  // };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Enhanced Back Button */}
        <Button
          variant="ghost"
          size="sm"
          className="mb-6 hover:bg-slate-100 transition-colors duration-200"
          onClick={() => router.back()}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Patients
        </Button>

        {/* Enhanced Patient Header */}
        <div className="bg-white rounded-2xl border-0 shadow-lg p-6 mb-6 hover:shadow-xl transition-all duration-300">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
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

            <div className="flex-1 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {patient.name}
                </h1>
                <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 font-medium px-3 py-1 rounded-full shadow-sm w-fit">
                  Serial #{patient.serial_number}
                </Badge>
              </div>

              {patient.old_serial_number && (
                <p className="text-slate-500 text-sm font-medium">
                  Previous ID: {patient.old_serial_number}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span>Created: {formatDate(patient.created_at)}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span>Last updated: {formatDate(patient.updated_at)}</span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium px-6 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                <Edit className="h-4 w-4 mr-2" />
                Edit Patient
              </Button>
              <Button
                variant="outline"
                className="border-slate-200 text-slate-700 hover:bg-slate-50 font-medium px-6 py-2.5 rounded-xl transition-all duration-200"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Visit
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <QuickStatsCard
            icon={Calendar}
            label="Days Since Created"
            value={Math.floor(
              (new Date().getTime() - new Date(patient.created_at).getTime()) /
                (1000 * 60 * 60 * 24)
            ).toString()}
            color="blue"
          />
          <QuickStatsCard
            icon={Phone}
            label="Contact Available"
            value={patient.phone ? "Yes" : "No"}
            color="green"
          />
          <QuickStatsCard
            icon={Dna}
            label="Miasm Type"
            value={patient.miasm_type || "Not Set"}
            color="purple"
          />
          <QuickStatsCard
            icon={ActivitySquare}
            label="Status"
            value="Active"
            color="orange"
          />
        </div>

        {/* Enhanced Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <div className="bg-white rounded-2xl border-0 shadow-lg p-1 mb-6">
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
              <Card className="bg-white border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-3">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <InfoItem
                    icon={Phone}
                    label="Primary Phone"
                    value={patient.phone}
                  />
                  {patient.relative_phone && (
                    <InfoItem
                      icon={Users}
                      label="Emergency Contact"
                      value={patient.relative_phone}
                    />
                  )}
                  {patient.address && (
                    <InfoItem
                      icon={MapPin}
                      label="Address"
                      value={patient.address}
                    />
                  )}
                </CardContent>
              </Card>

              {/* Current Treatment */}
              <Card className="bg-white border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-3">
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-lg">
                      <Stethoscope className="h-5 w-5 text-white" />
                    </div>
                    Current Treatment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <InfoItem
                    icon={Calendar}
                    label="Last Visit"
                    value={formatDate(patient.updated_at)}
                  />
                  {patient.miasm_type && (
                    <InfoItem
                      icon={Dna}
                      label="Miasm Selection"
                      value={
                        <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                          {patient.miasm_type}
                        </Badge>
                      }
                    />
                  )}
                  <InfoItem
                    icon={ActivitySquare}
                    label="Treatment Status"
                    value={
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        Active
                      </Badge>
                    }
                  />
                </CardContent>
              </Card>
            </div>

            {/* Patient Habits */}
            {/* {patient.habits && patient.habits.length > 0 && (
              <Card className="bg-white border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-3">
                    <div className="bg-gradient-to-br from-orange-500 to-red-500 p-2 rounded-lg">
                      <Heart className="h-5 w-5 text-white" />
                    </div>
                    Patient Habits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {patient.habits.map((habit, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-gradient-to-r from-slate-50 to-slate-100/50 rounded-xl border border-slate-200/60 hover:shadow-sm transition-all duration-200"
                      >
                        <div className="bg-gradient-to-br from-orange-500 to-red-500 p-2 rounded-lg shadow-sm">
                          <Heart className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-sm font-medium text-slate-900">
                          {habit}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )} */}
          </TabsContent>

          {/* Medical Tab */}
          <TabsContent value="medical" className="space-y-6">
            {/* Present Condition */}
            {patient.presentCause && (
              <Card className="bg-white border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-3">
                    <div className="bg-gradient-to-br from-red-500 to-pink-600 p-2 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-white" />
                    </div>
                    Present Condition
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    Current symptoms and primary concerns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 rounded-xl p-6 border border-slate-200/60">
                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {patient.presentCause}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Treatment Analysis */}
            <Card className="bg-white border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-3">
                  <div className="bg-gradient-to-br from-purple-500 to-violet-600 p-2 rounded-lg">
                    <Dna className="h-5 w-5 text-white" />
                  </div>
                  Treatment Analysis
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Detailed miasm analysis and treatment approach
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {patient.miasm_type && (
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2 text-slate-900">
                      <Shield className="h-4 w-4 text-purple-600" />
                      Miasm Classification
                    </h4>
                    <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-4 rounded-xl border border-purple-200/60">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-purple-600 font-medium">
                          Selected Miasm
                        </span>
                        <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                          {patient.miasm_type}
                        </Badge>
                      </div>
                      <Separator className="my-3 bg-purple-200/50" />
                      <p className="text-sm text-slate-600 leading-relaxed">
                        This miasm selection indicates a constitutional tendency
                        that helps guide the homeopathic treatment approach for
                        optimal therapeutic results.
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-slate-900">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    Treatment Timeline
                  </h4>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200/60">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-blue-600 font-medium mb-1">
                          Treatment Started
                        </p>
                        <p className="text-slate-900 font-semibold">
                          {formatDate(patient.created_at)}
                        </p>
                      </div>
                      <div>
                        <p className="text-blue-600 font-medium mb-1">
                          Last Updated
                        </p>
                        <p className="text-slate-900 font-semibold">
                          {formatDate(patient.updated_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            {/* Case History */}
            {patient.case_history && (
              <Card className="bg-white border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-3">
                    <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-2 rounded-lg">
                      <BookOpen className="h-5 w-5 text-white" />
                    </div>
                    Case History
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    Comprehensive medical background and previous treatments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 rounded-xl p-6 border border-slate-200/60">
                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {patient.case_history}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Treatment Timeline */}
            <Card className="bg-white border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-3">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-2 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  Treatment Timeline
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Record of consultations and treatment progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <TimelineItem
                    date={formatDate(patient.updated_at)}
                    title="Latest Update"
                    description="Patient record was last updated with current treatment status and progress notes."
                  />
                  <TimelineItem
                    date={formatDate(patient.created_at)}
                    title="Initial Assessment"
                    description="Patient was first registered in the system. Initial consultation completed and treatment plan established."
                    isLast={true}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Enhanced Floating Action Button */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3">
        <Button
          size="lg"
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Visit
        </Button>
      </div>
    </div>
  );
};

export default PatientDetail;
