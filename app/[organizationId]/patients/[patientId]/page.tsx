"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ChevronLeft } from "lucide-react";

import { getData } from "@/services/api";

import {
  LoadingComponent,
  ErrorLoadingComponent,
} from "@/components/LoadingComponent";

import PatientDetail from "./components/PatientDetail";
import Overview from "./components/Overview";
import Medical from "./components/Medical";
import History from "./components/History";

import { Appointment } from "./components/interface";
const PatientProfile = () => {
  const { organizationId, patientId } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [appointment, setAppointment] = useState<Appointment | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const [status, response] = await getData(
          `/organization/homeopathy/${organizationId}/patients/${patientId}`
        );

        const [appointmentStatus, appointmentResponse] = await getData(
          `/organization/homeopathy/${organizationId}/patients/${patientId}/appointments?recent=true`
        );

        console.log(
          "====================appointment=====================",
          appointmentResponse
        );

        if (appointmentStatus === 200) {
          setAppointment(appointmentResponse.results[0]);
        }

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

  if (!patient) {
    return <ErrorLoadingComponent message={"Patient not found"} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Enhanced Back Button */}
        <Button
          variant="ghost"
          size="sm"
          className="hover:bg-slate-100 transition-colors duration-200"
          onClick={() => router.back()}
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Patients
        </Button>
        <PatientDetail patient={patient} />
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
            <Overview patient={patient} />
          </TabsContent>

          {/* Medical Tab */}
          <TabsContent value="medical" className="space-y-1">
            <Medical patient={patient} />
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            {/* Appointment Statistics */}
            {appointment && (
              <History
                appointment={appointment}
                patientId={patientId}
                organizationId={organizationId}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PatientProfile;
