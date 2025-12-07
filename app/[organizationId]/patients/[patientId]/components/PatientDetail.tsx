// File: app/(organization)/[organizationId]/patients/[patientId]/components/PatientDetail.tsx
import { Calendar, Clock, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { formatDate } from "@/lib/utils";
import { getInitials } from "@/lib/patient.utils";
import { Patient } from "@/types/patient.types";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { deleteData } from "@/services/api";
import { Loader2 } from "lucide-react";

const PatientDetail = ({ patient }: { patient: Patient }) => {
  const router = useRouter();
  const { organizationId } = useParams();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      const [status] = await deleteData(
        `/organization/homeopathy/${organizationId}/patients/${patient.uid}`
      );

      if (status === 200 || status === 204) {
        router.push(`/${organizationId}/patients`);
      }
    } catch (error) {
      console.error("Failed to delete patient:", error);
    } finally {
      setDeleting(false);
    }
  };

  const handleEdit = () => {
    router.push(`/${organizationId}/patients/${patient.uid}/edit`);
  };

  return (
    <div className="bg-white rounded-2xl border-0 shadow-lg px-6 pb-4 pt-2 mb-2 hover:shadow-xl transition-all duration-300">
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
        <div className="flex flex-row justify-between items-center gap-4 w-full lg:w-auto">
          <Avatar className="h-20 w-20 lg:h-24 lg:w-24 ring-4 ring-white shadow-xl border-4 border-slate-100">
            <AvatarImage
              src={patient.avatar || "/placeholder.svg"}
              alt={patient.name}
            />
            <AvatarFallback className="bg-gradient-to-br from-[#205072] to-[#2d6a96] text-white font-bold text-xl">
              {getInitials(patient.name)}
            </AvatarFallback>
          </Avatar>

          <Card className="p-2 gap-2 bg-gradient-to-br from-red-50 to-pink-50 border-pink-200 shadow-sm hover:shadow-md transition-all duration-200 lg:hidden">
            <CardContent className="px-1">
              <div className="flex flex-col items-center">
                <div className="bg-gradient-to-br from-red-500 to-pink-500 p-2 rounded-lg">
                  <Calendar className="h-3 w-3 text-white" />
                </div>
                <p className="text-xs font-medium text-red-600">Total Visits</p>
                <p className="text-sm font-bold text-red-600">0</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#205072] to-[#2ab7ca] bg-clip-text text-transparent">
              {patient.name}
            </h1>
            <Badge className="bg-gradient-to-r from-[#205072] to-[#2d6a96] text-white border-0 font-medium px-3 py-1 rounded-full shadow-sm w-fit">
              Serial #{patient.serial_number}
            </Badge>
          </div>

          {patient.old_serial_number && (
            <p className="text-slate-500 text-sm font-medium">
              Old Serial Number: {patient.old_serial_number}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 text-sm">
            <div className="flex items-center gap-2 text-slate-600">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span>Created: {formatDate(patient.created_at)}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Clock className="h-4 w-4 text-slate-400" />
              <span>Last updated: {formatDate(patient.updated_at)}</span>
            </div>
          </div>
        </div>

        <div className="hidden lg:block">
          <Card className="p-3 gap-2 bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200 shadow-sm hover:shadow-md transition-all duration-200">
            <CardContent className="px-1">
              <div className="flex flex-col items-center">
                <div className="bg-gradient-to-br from-purple-500 to-violet-600 p-2 rounded-lg">
                  <Calendar className="h-4 w-4 text-white" />
                </div>
                <p className="text-xs font-medium text-purple-600">
                  Total Visits
                </p>
                <p className="text-lg font-bold text-purple-800">0</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto pt-2">
          <Button
            onClick={handleEdit}
            className="bg-gradient-to-r from-[#2ab7ca] to-[#2199aa] hover:from-[#2199aa] hover:to-[#187b8a] text-white font-medium px-6 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Patient
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="bg-gradient-to-r from-red-500 to-pink-500 text-white hover:bg-red-700 font-medium px-6 py-2.5 rounded-xl transition-all duration-200"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Patient</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete &quot;{patient.name}&quot;?
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700"
                  disabled={deleting}
                >
                  {deleting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default PatientDetail;
