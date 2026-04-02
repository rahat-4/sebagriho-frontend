"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, Loader2, AlertTriangle } from "lucide-react";
import { getData } from "@/services/api";
import { Patient } from "@/types/patient.types";
import PatientDetail from "./components/PatientDetail";
import Overview from "./components/Overview";
import Medical from "./components/Medical";
import History from "./components/History";
import { PatientAppointment } from "@/app/[organizationId]/patients/components/AddAppointment";

const PatientProfile = () => {
  const { organizationId, patientId } = useParams();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        setLoading(true);
        setError(null);

        const [status, response] = await getData(
          `/organization/homeopathy/${organizationId}/patients/${patientId}`
        );

        if (status !== 200) {
          throw new Error("Failed to fetch patient details");
        }

        setPatient(response);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch patient details"
        );
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
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center rounded-3xl border border-border/60 bg-white/80 p-8 shadow-sm backdrop-blur">
          <Loader2 className="w-8 h-8 animate-spin text-[#205072] mx-auto mb-4" />
          <p className="text-muted-foreground">Loading patient details...</p>
        </div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto rounded-3xl border border-border/60 bg-white/80 p-6 shadow-sm backdrop-blur">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            Error Loading Patient
          </h3>
          <p className="text-muted-foreground mb-4">{error || "Patient not found"}</p>
          <Button
            onClick={() => router.back()}
            className="bg-primary hover:bg-primary/90"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <Button
          variant="ghost"
          size="sm"
          className="mb-2 rounded-xl hover:bg-muted transition-colors duration-200"
          onClick={() => router.back()}
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Patients
        </Button>

        <PatientDetail patient={patient} />

        <Tabs defaultValue="overview" className="w-full">
          <div className="rounded-3xl border border-border/60 bg-white/80 p-1 shadow-sm backdrop-blur">
            <TabsList className="mx-auto grid w-full max-w-2xl grid-cols-3 rounded-2xl bg-muted/60 p-1">
              <TabsTrigger
                value="overview"
                className="rounded-xl font-medium transition-all duration-200 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-secondary-darker"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="medical"
                className="rounded-xl font-medium transition-all duration-200 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-secondary-darker"
              >
                Medical
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="rounded-xl font-medium transition-all duration-200 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-secondary-darker"
              >
                History
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6">
            <Overview patient={patient} />
          </TabsContent>

          <TabsContent value="medical" className="space-y-1">
            <Medical patient={patient} />
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <History
              patientId={patientId as string}
              organizationId={organizationId as string}
            />
          </TabsContent>
        </Tabs>
      </div>

      <div className="fixed bottom-6 right-6 flex flex-col gap-3 md:hidden">
        <PatientAppointment
          organizationId={organizationId as string}
          patientId={patientId as string}
        />
      </div>
    </div>
  );
};

export default PatientProfile;
