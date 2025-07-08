import {
  BookOpen,
  FileText,
  Dna,
  Calendar,
  Pill,
  Plus,
  TrendingUp,
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

import { Badge } from "@/components/ui/badge";

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
const AppointmentTimelineItem = ({
  appointment,
  isLast = false,
}: {
  appointment: Appointment;
  isLast?: boolean;
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "upcoming":
        return "bg-blue-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-slate-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "upcoming":
        return "Upcoming";
      case "cancelled":
        return "Cancelled";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="relative">
      <div className="flex items-start gap-4">
        <div className="flex flex-col items-center">
          <div
            className={`${getStatusColor(
              appointment.status
            )} p-2 rounded-full shadow-sm`}
          >
            <Calendar className="h-3 w-3 text-white" />
          </div>
          {!isLast && (
            <div className="w-0.5 h-16 bg-gradient-to-b from-slate-200 to-transparent mt-2" />
          )}
        </div>
        <div className="flex-1 pb-8">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-slate-900 text-sm">
                  Appointment
                </h4>
                <Badge
                  variant="outline"
                  className={`text-xs px-2 py-1 rounded-full ${
                    appointment.status === "completed"
                      ? "bg-green-50 text-green-600 border-green-200"
                      : appointment.status === "upcoming"
                      ? "bg-blue-50 text-blue-600 border-blue-200"
                      : "bg-red-50 text-red-600 border-red-200"
                  }`}
                >
                  {getStatusText(appointment.status)}
                </Badge>
              </div>
              <Badge
                variant="outline"
                className="text-xs bg-slate-50 text-slate-600 border-slate-200"
              >
                {new Date(appointment.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
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

            {/* Notes */}
            {appointment.notes && (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <BookOpen className="h-3 w-3 text-slate-500" />
                  <span className="text-xs font-medium text-slate-600">
                    Notes:
                  </span>
                </div>
                <p className="text-sm text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  {appointment.notes}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const AppointmentHistory = ({ appointments }: any) => {
  return (
    <div>
      {/* Appointment History */}
      <Card className="bg-white border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-4">
          <div className="flex flex-row items-center gap-4 justify-between">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-1">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-[5px] rounded-lg">
                <TrendingUp className="h-3 w-3 text-white" />
              </div>
              Recent
            </CardTitle>
            <Button
              onClick={() =>
                router.push(
                  `/organizations/${organizationId}/patients/${patientId}/appointments`
                )
              }
              variant="outline"
              size="sm"
              className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-medium rounded-lg transition-all duration-200"
            >
              <Calendar className="h-3 w-3" />
              All Appointments
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {appointments && appointments.length > 0 ? (
            <div className="space-y-4">
              {appointments.slice(0, 3).map((appointment, index) => (
                <AppointmentTimelineItem
                  key={appointment.id}
                  appointment={appointment}
                  isLast={index === Math.min(2, appointments.length - 1)}
                />
              ))}
              {appointments.length > 3 && (
                <div className="text-center pt-4">
                  <Button
                    onClick={() =>
                      router.push(
                        `/organizations/${organizationId}/patients/${patientId}/appointments`
                      )
                    }
                    variant="ghost"
                    size="sm"
                    className="text-indigo-600 hover:bg-indigo-50"
                  >
                    View {appointments.length - 3} more appointments
                  </Button>
                </div>
              )}
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

export default AppointmentHistory;
