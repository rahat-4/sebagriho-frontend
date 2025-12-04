import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Venus, Syringe, Users, MapPin, Calendar } from "lucide-react";
import { Patient } from "@/types/patient.types";

interface InfoItemProps {
  icon: React.ElementType;
  label: string;
  value: string | React.ReactNode;
}

const InfoItem = ({ icon: Icon, label, value }: InfoItemProps) => (
  <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-slate-50 to-slate-100/50 rounded-lg border border-slate-200/60 hover:shadow-sm transition-all duration-200">
    <div className="flex-shrink-0 bg-gradient-to-br from-[#205072] to-[#2d6a96] p-2 rounded-lg shadow-sm">
      <Icon className="h-4 w-4 text-white" />
    </div>
    <div className="flex flex-col min-w-0 flex-1">
      <span className="text-slate-500 text-xs font-medium uppercase tracking-wide">
        {label}
      </span>
      <span className="text-slate-900 text-sm font-semibold">
        {value || "Not provided"}
      </span>
    </div>
  </div>
);

const Overview = ({ patient }: { patient: Patient }) => {
  return (
    <div className="grid grid-cols-1 gap-6">
      <Card className="gap-2 px-0 py-3 bg-white border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-3">
            <div className="bg-gradient-to-br from-[#205072] to-[#2d6a96] p-2 rounded-lg">
              <Users className="h-5 w-5 text-white" />
            </div>
            General Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <InfoItem icon={Phone} label="Primary Phone" value={patient.phone} />
          {patient.gender && (
            <InfoItem icon={Venus} label="Gender" value={patient.gender} />
          )}
          {patient.age && (
            <InfoItem icon={Calendar} label="Age" value={patient.age} />
          )}
          {patient.blood_group && (
            <InfoItem
              icon={Syringe}
              label="Blood Group"
              value={patient.blood_group}
            />
          )}
          {patient.relative_phone && (
            <InfoItem
              icon={Users}
              label="Emergency Contact"
              value={patient.relative_phone}
            />
          )}
          {patient.address && (
            <InfoItem icon={MapPin} label="Address" value={patient.address} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Overview;
