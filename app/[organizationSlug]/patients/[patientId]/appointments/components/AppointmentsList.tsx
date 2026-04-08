"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Calendar as CalendarIcon } from "lucide-react";
import { Appointment } from "./types";
import { AppointmentCard } from "./AppointmentCard";

interface AppointmentsListProps {
  appointments: Appointment[];
  onView: (appointment: Appointment) => void;
  onDelete: (appointmentId: string) => void;
  hasDateFilter: boolean;
}

export const AppointmentsList = ({
  appointments,
  onView,
  onDelete,
  hasDateFilter,
}: AppointmentsListProps) => {
  if (appointments.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <CalendarIcon className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">
            No appointments found
          </h3>
          <p className="text-slate-500">
            {hasDateFilter
              ? "No appointments found in the selected date range"
              : "No appointments have been created yet"}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {appointments.map((appointment) => (
        <AppointmentCard
          key={appointment.uid}
          appointment={appointment}
          onView={onView}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
