"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileText, Pill, Activity, Download } from "lucide-react";
import { format } from "date-fns";
import { Appointment } from "./types";

interface AppointmentDetailsDialogProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AppointmentDetailsDialog = ({
  appointment,
  isOpen,
  onClose,
}: AppointmentDetailsDialogProps) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy 'at' hh:mm a");
    } catch {
      return dateString;
    }
  };

  if (!appointment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto rounded-3xl border-border/60 bg-background shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-foreground">Appointment Details</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Created on {formatDate(appointment.created_at)}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {/* Symptoms */}
          <div>
            <h4 className="mb-2 flex items-center gap-2 font-semibold text-foreground">
              <Activity className="h-4 w-4 text-red-500" />
              Symptoms
            </h4>
            <p className="rounded-xl border border-border/60 bg-muted/30 p-3 text-foreground">
              {appointment.symptoms}
            </p>
          </div>

          {/* Treatment Effectiveness */}
          {appointment.treatment_effectiveness && (
            <div>
              <h4 className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                <Activity className="h-4 w-4 text-blue-500" />
                Treatment Effectiveness
              </h4>
              <p className="rounded-xl border border-border/60 bg-muted/30 p-3 text-foreground">
                {appointment.treatment_effectiveness}
              </p>
            </div>
          )}

          {/* Medicines */}
          {appointment.medicines.length > 0 && (
            <div>
              <h4 className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                <Pill className="h-4 w-4 text-purple-500" />
                Prescribed Medicines
              </h4>
              <div className="rounded-xl border border-border/60 bg-muted/30 p-3">
                <div className="flex flex-wrap gap-2">
                  {appointment.medicines.map((medicine) => (
                    <Badge
                      key={medicine.uid}
                      variant="secondary"
                      className="bg-primary/10 px-3 py-1 text-primary"
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
            <div>
              <h4 className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                <FileText className="h-4 w-4 text-orange-500" />
                Attachment
              </h4>
              <div className="rounded-xl border border-border/60 bg-muted/30 p-3">
                <Button variant="outline" size="sm" className="rounded-lg border-border/60">
                  <Download className="h-4 w-4 mr-2" />
                  Download File
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export const DeleteConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: DeleteConfirmDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="rounded-3xl border-border/60 bg-background shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-foreground">Delete Appointment</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Are you sure you want to delete this appointment? This action cannot
            be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose} className="rounded-xl border-border/60">
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
            className="rounded-xl"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
