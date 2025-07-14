"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RefreshCw, AlertCircle } from "lucide-react";
import { getData, deleteData } from "@/services/api";
import { Appointment, Patient } from "./components/types";
import { PatientInfoCard } from "./components/PatientInfoCard";
import { AppointmentFilters } from "./components/AppointmentFilters";
import { AppointmentsList } from "./components/AppointmentsList";
import {
  AppointmentDetailsDialog,
  DeleteConfirmDialog,
} from "./components/AppointmentDialog";

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

const PatientAppointmentList = () => {
  const { organizationId, patientId } = useParams();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Fetch appointments and patient data
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Build appointments URL with ordering
      const baseUrl = `/organization/homeopathy/${organizationId}/patients/${patientId}/appointments`;
      const params = new URLSearchParams();
      const orderPrefix = sortOrder === "desc" ? "-" : "";
      params.append("ordering", `${orderPrefix}created_at`);

      const appointmentsUrl = `${baseUrl}?${params.toString()}`;
      const [appointmentsStatus, appointmentsResponse] = await getData(
        appointmentsUrl
      );

      // Fetch patient data
      const patientUrl = `/organization/homeopathy/${organizationId}/patients/${patientId}`;
      const [patientStatus, patientResponse] = await getData(patientUrl);

      if (patientStatus === 200) {
        setPatient({
          name: patientResponse.name || "Unknown Patient",
          serial_number: patientResponse.serial_number,
          old_serial_number: patientResponse.old_serial_number,
          phone: patientResponse.phone,
          image: patientResponse.image,
        });
      }

      if (appointmentsStatus === 200) {
        let appointmentData;
        if (appointmentsResponse.results) {
          appointmentData = appointmentsResponse.results;
        } else if (appointmentsResponse.data) {
          appointmentData = appointmentsResponse.data;
        } else if (Array.isArray(appointmentsResponse)) {
          appointmentData = appointmentsResponse;
        } else {
          appointmentData = [];
        }

        setAppointments(Array.isArray(appointmentData) ? appointmentData : []);
      } else {
        setError(`Failed to load appointments (Status: ${appointmentsStatus})`);
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError("Network error while loading data");
    } finally {
      setLoading(false);
    }
  }, [organizationId, patientId, sortOrder]);

  // Delete appointment
  const handleDeleteAppointment = async (appointmentId: string) => {
    setDeleteLoading(true);
    try {
      const url = `/organization/homeopathy/${organizationId}/patients/${patientId}/appointments/${appointmentId}`;
      const [status] = await deleteData(url);

      if (status === 200 || status === 204) {
        setAppointments((prev) =>
          prev.filter((app) => app.uid !== appointmentId)
        );
        setShowDeleteConfirm(null);
      } else {
        setError("Failed to delete appointment");
      }
    } catch (err) {
      console.error("Failed to delete appointment:", err);
      setError("Network error while deleting appointment");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Filter appointments by date range
  const filteredAppointments = useMemo(() => {
    if (!dateRange.from && !dateRange.to) {
      return appointments;
    }

    return appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.created_at);
      appointmentDate.setHours(0, 0, 0, 0);

      if (dateRange.from && dateRange.to) {
        const fromDate = new Date(dateRange.from);
        const toDate = new Date(dateRange.to);
        fromDate.setHours(0, 0, 0, 0);
        toDate.setHours(23, 59, 59, 999);
        return appointmentDate >= fromDate && appointmentDate <= toDate;
      } else if (dateRange.from) {
        const fromDate = new Date(dateRange.from);
        fromDate.setHours(0, 0, 0, 0);
        return appointmentDate >= fromDate;
      } else if (dateRange.to) {
        const toDate = new Date(dateRange.to);
        toDate.setHours(23, 59, 59, 999);
        return appointmentDate <= toDate;
      }

      return true;
    });
  }, [appointments, dateRange]);

  const hasDateFilter = dateRange.from || dateRange.to;

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-emerald-500 mx-auto mb-4" />
          <p className="text-slate-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 mx-4">
      {/* Patient Information Header */}
      {patient && <PatientInfoCard patient={patient} />}

      {/* Filters */}
      <AppointmentFilters
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        dateRange={dateRange}
        setDateRange={setDateRange}
        showDatePicker={showDatePicker}
        setShowDatePicker={setShowDatePicker}
        appointmentCount={filteredAppointments.length}
      />

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Appointments List */}
      <AppointmentsList
        appointments={filteredAppointments}
        onView={setSelectedAppointment}
        onDelete={setShowDeleteConfirm}
        hasDateFilter={hasDateFilter}
      />

      {/* View Details Dialog */}
      <AppointmentDetailsDialog
        appointment={selectedAppointment}
        isOpen={selectedAppointment !== null}
        onClose={() => setSelectedAppointment(null)}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={showDeleteConfirm !== null}
        onClose={() => setShowDeleteConfirm(null)}
        onConfirm={() =>
          showDeleteConfirm && handleDeleteAppointment(showDeleteConfirm)
        }
        isLoading={deleteLoading}
      />
    </div>
  );
};

export default PatientAppointmentList;
