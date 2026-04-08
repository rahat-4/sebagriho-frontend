"use client";

import { Card, CardContent } from "@/components/ui/card";
import { User, Hash, Phone } from "lucide-react";
import { Patient } from "./types";

interface PatientInfoCardProps {
  patient: Patient;
}

export const PatientInfoCard = ({ patient }: PatientInfoCardProps) => {
  console.log(patient);
  return (
    <Card className="mt-3 bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200 sticky top-0">
      <CardContent>
        <div className="flex items-center gap-3">
          {patient.image ? (
            <img
              src={patient.image}
              alt={patient.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-emerald-200"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center border-2 border-emerald-200">
              <User className="h-8 w-8 text-emerald-600" />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-lg font-bold text-slate-800">{patient.name}</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
              {patient.serial_number && (
                <div className="flex items-center gap-1">
                  <Hash className="h-3 w-3 text-slate-500" />
                  <span className="text-slate-600">
                    Serial: {patient.serial_number}
                  </span>
                </div>
              )}
              {patient.old_serial_number && (
                <div className="flex items-center gap-1">
                  <Hash className="h-3 w-3 text-slate-500" />
                  <span className="text-slate-600">
                    Old Serial: {patient.old_serial_number}
                  </span>
                </div>
              )}
              {patient.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="h-3 w-3 text-slate-500" />
                  <span className="text-slate-600">{patient.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
