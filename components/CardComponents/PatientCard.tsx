"use client";

import React, { useState, useEffect } from "react";
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

// Info item component to reduce repetitive code
const InfoItem = ({ icon: Icon, label, value }: InfoItemProps) => (
  <div className="flex items-center gap-1 text-sm text-gray-600 bg-gray-50 px-3 rounded-lg">
    <Icon className="h-3 w-3 text-blue-500" />
    <div>
      <span className="text-gray-500 text-xs">{label}:</span>
      <span className="font-medium ml-1 text-xs">{value}</span>
    </div>
  </div>
);
const PatientCard = ({ organizationId, patientId }: PatientsProps) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const [status, response] = await getData(
          `/organization/homeopathy/${organizationId}/patients`
        );

        if (status !== 200) {
          setError("Failed to fetch organizations");
          return;
        }
        console.log("response", response);
      } catch (error: any) {
        setError(error.message || "Failed to fetch organizations");
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [organizationId, patientId]);

  return (
    <Card className="gap-4 p-2 w-full max-w-md mx-auto rounded shadow border-0">
      <CardHeader className="pb-0 gap-0">
        <div className="flex justify-between items-center">
          <div>
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-600 border-blue-200 font-medium mb-1"
            >
              Serial #01
            </Badge>
            <CardDescription className="text-xs text-gray-500">
              Previous ID: 121
            </CardDescription>
          </div>
          <Avatar className="h-12 w-12 ring-2 ring-blue-100">
            <AvatarImage src="" alt="Patient" />
            <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
              JD
            </AvatarFallback>
          </Avatar>
        </div>
      </CardHeader>

      <CardContent className="space-y-1">
        <div className="pb-1">
          <h3 className="font-semibold text-md text-gray-800">John Doe</h3>
          <div className="flex items-center gap-1 text-gray-500">
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

      <CardFooter className="border-t border-gray-200 pt-2 pb-1">
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className="text-xs text-gray-400">
              Last visit: 2 weeks ago
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-600 font-medium hover:bg-blue-50 hover:text-blue-700 transition-colors px-3 py-1 h-auto"
          >
            Details <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PatientCard;
