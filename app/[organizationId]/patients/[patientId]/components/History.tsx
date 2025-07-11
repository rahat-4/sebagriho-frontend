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
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between mb-3">
          <Badge
            variant="outline"
            className="text-xs bg-slate-50 text-slate-600 border-slate-200"
          >
            {formatDate(appointment.created_at)}
          </Badge>
          <Badge
            variant="outline"
            className="text-xs bg-slate-50 text-slate-600 border-slate-200"
          >
            {formatTime(appointment.created_at)}
          </Badge>
        </div>

        {/* Symptoms */}
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="h-3 w-3 text-red-500" />
            <span className="text-xs font-medium text-slate-600">
              Symptoms:
            </span>
          </div>
          <p className="text-sm text-slate-700 bg-red-50 p-2 rounded-lg border border-red-100">
            {appointment.symptoms}
          </p>
        </div>

        {/* Treatment Effectiveness */}
        {appointment.treatment_effectiveness && (
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-xs font-medium text-slate-600">
                Treatment Effectiveness:
              </span>
            </div>
            <p className="text-sm text-slate-700 bg-green-50 p-2 rounded-lg border border-green-100">
              {appointment.treatment_effectiveness}
            </p>
          </div>
        )}

        {/* Medicines */}
        {appointment.medicines && appointment.medicines.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-2">
              <Pill className="h-3 w-3 text-blue-500" />
              <span className="text-xs font-medium text-slate-600">
                Prescribed Medicines:
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {appointment.medicines.map((medicine, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs bg-blue-50 text-blue-700 border-blue-200 px-2 py-1"
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
                <span className="text-xs font-medium text-slate-600">
                  Attached Files:
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {appointment.appointment_files.map((file, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs h-6 px-2 bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
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
      } catch (error: any) {
        setError(error.message || "Failed to fetch appointment details");
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
      <Card className="bg-white border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <div className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-1">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-[5px] rounded-lg">
                <TrendingUp className="h-3 w-3 text-white" />
              </div>
              Recent
            </CardTitle>
            <Link
              href={`/${organizationId}/patients/${patientId}/appointments`}
              passHref
            >
              <Button
                variant="outline"
                size="sm"
                className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-medium rounded-lg transition-all duration-200"
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
            <div className="text-center py-8">
              <div className="bg-slate-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Calendar className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-md font-semibold text-slate-900 mb-2">
                No Appointments Yet
              </h3>
              <p className="text-slate-600 mb-4 text-xs">
                This patient hasn't had any appointments recorded.
              </p>
              <Button
                onClick={() => {
                  // Trigger the appointment booking modal or navigate to booking page
                  // You can call your PatientAppointment component's function here
                }}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
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
