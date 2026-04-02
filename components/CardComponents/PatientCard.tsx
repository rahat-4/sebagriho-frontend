"use client";

import React, { useEffect } from "react";
import { getData } from "@/services/api";
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
import {
  Calendar,
  Phone,
  Pill,
  ArrowRight,
  Dna,
  ActivitySquare,
} from "lucide-react";

interface PatientsProps {
  organizationId: string;
  patientId: string;
}

interface InfoItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
}

const InfoItem = ({ icon: Icon, label, value }: InfoItemProps) => (
  <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
    <Icon className="h-3 w-3 text-primary" />
    <div>
      <span className="text-xs text-muted-foreground">{label}:</span>
      <span className="ml-1 text-xs font-medium text-foreground">{value}</span>
    </div>
  </div>
);
const PatientCard = ({ organizationId, patientId }: PatientsProps) => {
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const [status] = await getData(
          `/organization/homeopathy/${organizationId}/patients`
        );

        if (status !== 200) {
          console.error("Failed to fetch organizations");
          return;
        }
      } catch (error) {
        console.error("Failed to fetch organizations:", error);
      }
    };

    fetchPatients();
  }, [organizationId, patientId]);

  return (
    <Card className="mx-auto w-full max-w-md rounded-3xl border-border/60 bg-white p-2 shadow-sm">
      <CardHeader className="pb-0 gap-0">
        <div className="flex justify-between items-center">
          <div>
            <Badge
              variant="outline"
              className="mb-1 border-border/60 bg-primary/10 font-medium text-primary"
            >
              Serial #01
            </Badge>
            <CardDescription className="text-xs text-muted-foreground">
              Previous ID: 121
            </CardDescription>
          </div>
          <Avatar className="h-12 w-12 ring-4 ring-background">
            <AvatarImage src="" alt="Patient" />
            <AvatarFallback className="bg-primary/10 font-medium text-primary">
              JD
            </AvatarFallback>
          </Avatar>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="pb-1">
          <h3 className="text-md font-semibold text-foreground">John Doe</h3>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Phone className="h-3 w-3" />
            <span className="text-xs">123456789</span>
          </div>
        </div>

        <InfoItem icon={Dna} label="Miasm selection" value="Syphilis" />
        <InfoItem
          icon={ActivitySquare}
          label="Effectiveness"
          value="Improved"
        />
        <InfoItem icon={Pill} label="Medicine Date" value="01/01/2023" />
      </CardContent>

      <CardFooter className="border-t border-border/60 pt-2 pb-1">
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              Last visit: 2 weeks ago
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-auto px-3 py-1 font-medium text-primary transition-colors hover:bg-primary/5 hover:text-primary"
          >
            Details <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PatientCard;
