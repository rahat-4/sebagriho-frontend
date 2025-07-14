"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Calendar as CalendarIcon,
  FileText,
  Pill,
  Activity,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Download,
} from "lucide-react";
import { format } from "date-fns";
import { Appointment } from "./types";

interface AppointmentCardProps {
  appointment: Appointment;
  onView: (appointment: Appointment) => void;
  onDelete: (appointmentId: string) => void;
}

export const AppointmentCard = ({
  appointment,
  onView,
  onDelete,
}: AppointmentCardProps) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy 'at' hh:mm a");
    } catch {
      return dateString;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <CalendarIcon className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
              <CardTitle className="text-md">
                {formatDate(appointment.created_at)}
              </CardTitle>
            </div>
          </div>
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onView(appointment)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                {appointment.appointment_file && (
                  <DropdownMenuItem>
                    <Download className="h-4 w-4 mr-2" />
                    Download File
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600"
                  onClick={() => onDelete(appointment.uid)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Symptoms */}
        <div className="flex items-start gap-2">
          <Activity className="h-4 w-4 text-red-500 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-sm text-slate-700">Symptoms</h4>
            <p className="text-sm text-slate-600 line-clamp-2">
              {appointment.symptoms}
            </p>
          </div>
        </div>

        {/* Treatment Effectiveness */}
        {appointment.treatment_effectiveness && (
          <div className="flex items-start gap-2">
            <Activity className="h-4 w-4 text-blue-500 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-sm text-slate-700">
                Treatment Effectiveness
              </h4>
              <p className="text-sm text-slate-600 line-clamp-2">
                {appointment.treatment_effectiveness}
              </p>
            </div>
          </div>
        )}

        {/* Medicines */}
        {appointment.medicines.length > 0 && (
          <div className="flex items-start gap-2">
            <Pill className="h-4 w-4 text-purple-500 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-sm text-slate-700 mb-1">
                Prescribed Medicines
              </h4>
              <div className="flex flex-wrap gap-2">
                {appointment.medicines.map((medicine) => (
                  <Badge
                    key={medicine.uid}
                    variant="secondary"
                    className="px-2 py-1 bg-purple-100 text-purple-800"
                  >
                    <Pill className="w-3 h-3 mr-1" />
                    {medicine.name}
                    {medicine.power && (
                      <span className="ml-1 text-xs">({medicine.power})</span>
                    )}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* File */}
        {appointment.appointment_file && (
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-orange-500" />
            <div className="flex-1">
              <h4 className="font-semibold text-sm text-slate-700">
                Attachment
              </h4>
              <p className="text-sm text-slate-600">File available</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
