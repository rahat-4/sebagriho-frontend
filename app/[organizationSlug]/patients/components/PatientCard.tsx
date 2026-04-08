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

const InfoItem = ({ icon: Icon, label, value }: InfoItemProps) => (
  <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/30 px-3 py-2 transition-colors hover:bg-muted/50">
    <div className="flex-shrink-0 rounded-lg bg-primary/10 p-2 text-primary">
      <Icon className="h-3 w-3 text-white" />
    </div>
    <div className="flex flex-col min-w-0 flex-1">
      <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="truncate text-[10px] font-semibold text-foreground">
        {value}
      </span>
    </div>
  </div>
);

const PatientCard = ({ patient }: { patient: Patient }) => {
  const router = useRouter();
  const { organizationSlug } = useParams();

  return (
    <Card className="group overflow-hidden rounded-3xl border-border/60 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <CardHeader className="border-b border-border/60 bg-muted/20 px-4 py-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <Badge className="rounded-full border-0 bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
              Serial #{patient.serial_number}
            </Badge>
            <CardDescription className="pl-1 text-[11px] font-medium text-muted-foreground">
              Old Serial: {patient.old_serial_number}
            </CardDescription>
          </div>
          <Avatar className="h-10 w-10 border border-border/60 shadow-sm ring-4 ring-background">
            <AvatarImage
              src={patient.avatar || "/placeholder.svg"}
              alt={patient.name}
            />
            <AvatarFallback className="bg-primary text-primary-foreground font-bold text-xs">
              {patient.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 px-4 py-4">
        <div className="space-y-1">
          <h3 className="text-base font-semibold leading-tight text-foreground transition-colors group-hover:text-primary">
            {patient.name}
          </h3>
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="rounded-lg bg-emerald-500/10 p-2">
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
          <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/30 px-3 py-2">
            <div className="flex-shrink-0 rounded-lg bg-primary/10 p-2 text-primary">
              <ActivitySquare className="h-3 w-3 text-white" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
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

      <CardFooter className="border-t border-border/60 bg-muted/10 px-4 py-4">
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-orange-500/10 p-2">
              <Calendar className="h-3 w-3 text-orange-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-medium text-muted-foreground">
                Last visit
              </span>
              <span className="text-xs font-semibold text-foreground">
                {new Date(patient.updated_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
          <Button
            size={"sm"}
            onClick={() =>
              router.push(`/${organizationSlug}/patients/${patient.uid}`)
            }
            className="rounded-xl bg-primary px-4 text-xs font-medium text-primary-foreground shadow-sm transition-all duration-200 hover:bg-primary/90 hover:shadow-md"
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
