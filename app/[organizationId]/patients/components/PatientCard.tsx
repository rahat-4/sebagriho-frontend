"use client";

import { useParams, useRouter } from "next/navigation";
import type React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Calendar, Phone, ArrowRight, Dna, ActivitySquare } from "lucide-react";

interface InfoItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
}

export interface Patient {
  uid: string;
  serial_number: string;
  old_serial_number?: string;
  first_name?: string;
  last_name?: string;
  name: string;
  avatar?: string;
  blood_group?: string;
  address?: string;
  phone: string;
  relative_phone?: string;
  case_history?: string;
  presentCause?: string;
  miasm_type: string;
  habits?: string[];
  created_at: string;
  updated_at: string;
  // effectiveness: string;
}

// Enhanced Info item component
const InfoItem = ({ icon: Icon, label, value }: InfoItemProps) => (
  <div className="flex items-center gap-3 p-1 bg-gradient-to-r from-slate-50 to-slate-100/50 rounded-lg border border-slate-200/60 hover:shadow-sm transition-all duration-200">
    <div className="flex-shrink-0 bg-gradient-to-br from-red-500 to-pink-500 p-[5px] rounded-lg shadow-sm">
      <Icon className="h-3 w-3 text-white" />
    </div>
    <div className="flex flex-col min-w-0 flex-1">
      <span className="text-slate-500 text-[11px] font-medium uppercase tracking-wide">
        {label}
      </span>
      <span className="text-slate-900 text-[11px] font-semibold truncate">
        {value}
      </span>
    </div>
  </div>
);

// Enhanced Patient Card Component
const PatientCard = ({ patient }: { patient: Patient }) => {
  const router = useRouter();
  const { organizationId } = useParams();

  return (
    <Card className="gap-3 group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 border-slate-200 bg-white shadow-md hover:-translate-y-1 rounded-2xl overflow-hidden">
      <CardHeader className="gap-0 px-2 bg-gradient-to-br from-slate-50 to-white border-b border-slate-100 [.border-b]:pb-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <Badge className="bg-gradient-to-br from-[#2ab7ca] to-[#4dc4d4] text-white border-0 font-medium text-[11px] px-2 py-1 rounded-full shadow-sm">
              Serial #{patient.serial_number}
            </Badge>
            <CardDescription className="text-[11px] pl-2 text-slate-500 font-medium">
              Old Serial: {patient.old_serial_number}
            </CardDescription>
          </div>
          <Avatar className="h-10 w-10 ring-4 ring-white shadow-lg border-2 border-slate-100">
            <AvatarImage
              src={patient.avatar || "/placeholder.svg"}
              alt={patient.name}
            />
            <AvatarFallback className="bg-gradient-to-br from-[#205072] to-[#2d6a96] text-white font-bold text-lg">
              {patient.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 px-4 [.border-b]:pt-2">
        <div className="space-y-1">
          <h3 className="font-bold text-md text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">
            {patient.name}
          </h3>
          <div className="flex items-center gap-2 text-slate-600">
            <div className="bg-emerald-100 p-[5px] rounded-lg">
              <Phone className="h-3 w-3 text-emerald-600" />
            </div>
            <span className="text-sm font-medium">{patient.phone}</span>
          </div>
        </div>

        <div className="space-y-1">
          <InfoItem
            icon={Dna}
            label="Miasm Selection"
            value={patient?.miasm_type}
          />
          <div className="flex items-center gap-3 p-1 bg-gradient-to-r from-slate-50 to-slate-100/50 rounded-lg border border-slate-200/60">
            <div className="flex-shrink-0 bg-gradient-to-br from-red-500 to-pink-500 p-[5px] rounded-lg shadow-sm">
              <ActivitySquare className="h-3 w-3 text-white" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-slate-500 text-[11px] font-medium uppercase tracking-wide">
                Effectiveness
              </span>
              {/* <Badge
                className={`${getEffectivenessColor(
                  patient.effectiveness
                )} text-[11px] font-semibold w-fit mt-1`}
              >
                {patient.effectiveness}
              </Badge> */}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t border-slate-100 bg-slate-50/50 px-2 [.border-t]:pt-3">
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-lg">
              <Calendar className="h-3 w-3 text-orange-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] text-slate-500 font-medium">
                Last visit
              </span>
              <span className="text-xs text-slate-900 font-semibold">
                {new Date(patient.updated_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
          <Button
            onClick={() =>
              router.push(`/${organizationId}/patients/${patient.uid}`)
            }
            className="bg-gradient-to-br from-navy-light to-navy-lighter hover:from-indigo-600 hover:to-purple-700 text-white font-medium transition-all duration-200 px-6 py-2.5 rounded-xl shadow-sm hover:shadow-md"
          >
            View Details
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PatientCard;
