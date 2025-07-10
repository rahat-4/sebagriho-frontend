import { Calendar, Clock, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import { formatDate } from "@/lib/utils";

import { Patient } from "./interface";

const PatientDetail = ({ patient }: { patient: Patient }) => {
  return (
    <div className="bg-white rounded-2xl border-0 shadow-lg px-6 pb-4 pt-2 mb-2 hover:shadow-xl transition-all duration-300">
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2">
        <div className="flex flex-row justify-between items-center gap-4 w-full lg:w-auto">
          <Avatar className="h-20 w-20 lg:h-24 lg:w-24 ring-4 ring-white shadow-xl border-4 border-slate-100">
            <AvatarImage
              src={patient.avatar || "/placeholder.svg"}
              alt={patient.name}
            />
            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-xl">
              {/* {getInitials(patient.name)} */}
              {patient.name}
            </AvatarFallback>
          </Avatar>
          <div className="grid grid-cols-1 md:grid-cols-3">
            <Card className="p-2 gap-2 bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200 shadow-sm hover:shadow-md transition-all duration-200">
              <CardContent className="px-1">
                <div className="flex flex-col items-center">
                  <div className="bg-gradient-to-br from-purple-500 to-violet-600 p-2 rounded-lg">
                    <Calendar className="h-3 w-3 text-white" />
                  </div>
                  <p className="text-xs font-medium text-purple-600">
                    Total visited
                  </p>
                  <p className="text-sm font-bold text-purple-800">0</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex-1 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {patient.name}
            </h1>
            <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 font-medium px-3 py-1 rounded-full shadow-sm w-fit">
              Serial #{patient.serial_number}
            </Badge>
          </div>

          <p className="text-slate-500 text-sm font-medium">
            Old Serial Number: {patient.old_serial_number}
          </p>

          <div className="flex flex-wrap items-center gap-1 text-sm">
            <div className="flex items-center gap-1 text-slate-600">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span>Created: {formatDate(patient.created_at)}</span>
            </div>
            <div className="flex items-center gap-1 text-slate-600">
              <Clock className="h-4 w-4 text-slate-400" />
              <span>Last updated: {formatDate(patient.updated_at)}</span>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-1 w-full lg:w-auto pt-2">
          <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium px-6 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
            <Edit className="h-4 w-4 mr-2" />
            Edit Patient
          </Button>
          <Button
            variant="outline"
            className="border-red-200 bg-red-600 text-white hover:bg-red-50 font-medium px-6 py-2.5 rounded-xl transition-all duration-200"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Patient
          </Button>
        </div>
      </div>
      {/* Enhanced Floating Action Button */}
      {/* <div className="fixed bottom-6 right-6 flex flex-col gap-3">
          <PatientAppointment
            organizationId={organizationId}
            patientId={patientId}
          />
        </div> */}
    </div>
  );
};

export default PatientDetail;
