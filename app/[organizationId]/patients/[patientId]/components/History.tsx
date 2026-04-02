"use client";

import { useEffect, useState } from "react";
import { ParamValue } from "next/dist/server/request/params";

import Link from "next/link";

import {
  FileText,
  Calendar,
  Pill,
  Plus,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { getData } from "@/services/api";
import { formatDate, formatTime } from "@/lib/utils";
import {
  ErrorLoadingComponent,
  LoadingComponent,
} from "@/components/LoadingComponent";

import { Appointment } from "./interface";

const AppointmentTimelineItem = ({
  appointment,
}: {
  appointment: Appointment;
}) => {
  return (
    <div className="flex-1 pb-8">
      <div className="rounded-2xl border border-border/60 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md">
        <div className="mb-3 flex items-center justify-between gap-2">
          <Badge
            variant="outline"
            className="border-border/60 bg-muted/40 text-xs text-muted-foreground"
          >
            {formatDate(appointment.created_at)}
          </Badge>
          <Badge
            variant="outline"
            className="border-border/60 bg-muted/40 text-xs text-muted-foreground"
          >
            {formatTime(appointment.created_at)}
          </Badge>
        </div>

        {/* Symptoms */}
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="h-3 w-3 text-red-500" />
            <span className="text-xs font-medium text-muted-foreground">
              Symptoms:
            </span>
          </div>
          <p className="rounded-lg border border-rose-500/10 bg-rose-500/5 p-3 text-sm text-foreground">
            {appointment.symptoms}
          </p>
        </div>

        {/* Treatment Effectiveness */}
        {appointment.treatment_effectiveness && (
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-xs font-medium text-muted-foreground">
                Treatment Effectiveness:
              </span>
            </div>
            <p className="rounded-lg border border-emerald-500/10 bg-emerald-500/5 p-3 text-sm text-foreground">
              {appointment.treatment_effectiveness}
            </p>
          </div>
        )}

        {/* Medicines */}
        {appointment.medicines && appointment.medicines.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-2">
              <Pill className="h-3 w-3 text-blue-500" />
              <span className="text-xs font-medium text-muted-foreground">
                Prescribed Medicines:
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {appointment.medicines.map((medicine, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="border-border/60 bg-primary/10 px-2 py-1 text-xs text-primary"
                >
                  {medicine}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Appointment Files */}
        {appointment.appointment_files &&
          appointment.appointment_files.length > 0 && (
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-3 w-3 text-purple-500" />
                <span className="text-xs font-medium text-muted-foreground">
                  Attached Files:
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {appointment.appointment_files.map((file, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="h-7 border-border/60 bg-violet-500/10 px-3 text-xs text-violet-700 hover:bg-violet-500/15"
                  >
                    <FileText className="h-3 w-3 mr-1" />
                    File {index + 1}
                  </Button>
                ))}
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

interface HistoryProps {
  patientId: ParamValue;
  organizationId: ParamValue;
}

const History = ({ patientId, organizationId }: HistoryProps) => {
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentAppointment = async () => {
      try {
        const [status, response] = await getData(
          `/organization/homeopathy/${organizationId}/patients/${patientId}/appointments?recent=true`
        );

        if (status !== 200) {
          setError("Failed to fetch appointment details");
          return;
        }

        setAppointment(response);
      } catch (error) {
        console.error("Failed to fetch appointment details:", error);
        setError("Failed to fetch appointment details");
      } finally {
        setLoading(false);
      }
    };

    if (organizationId && patientId) {
      fetchCurrentAppointment();
    }
  }, [organizationId, patientId]);

  if (loading) {
    return <LoadingComponent name="Loading recent appointment..." />;
  }

  if (error) {
    return <ErrorLoadingComponent message={"Appointment not found"} />;
  }

  return (
    <div>
      {/* Appointment History */}
      <Card className="rounded-3xl border-border/60 bg-white shadow-sm transition-all duration-300 hover:shadow-md">
        <CardHeader>
          <div className="flex flex-row items-center justify-between gap-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600">
                <TrendingUp className="h-3 w-3 text-white" />
              </div>
              Recent
            </CardTitle>
            <Link
              href={`/${organizationId}/patients/${patientId}/appointments`}
            >
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg border-border/60 font-medium text-primary transition-all duration-200 hover:bg-primary/5"
              >
                <Calendar className="h-3 w-3" />
                All Appointments
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {appointment ? (
            <div className="space-y-4">
              <AppointmentTimelineItem
                key={appointment.uid}
                appointment={appointment}
              />
            </div>
          ) : (
            <div className="py-10 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-base font-semibold text-foreground">
                No Appointments Yet
              </h3>
              <p className="mb-4 text-xs text-muted-foreground">
                This patient hasn&apos;t had any appointments recorded.
              </p>
              <Button
                onClick={() => {
                  // Trigger the appointment booking modal or navigate to booking page
                  // You can call your PatientAppointment component's function here
                }}
                className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Book First Appointment
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default History;
