import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Venus, Syringe, Users, MapPin, Calendar } from "lucide-react";
import { Patient } from "@/types/patient.types";

interface InfoItemProps {
  icon: React.ElementType;
  label: string;
  value: string | React.ReactNode;
}

const InfoItem = ({ icon: Icon, label, value }: InfoItemProps) => (
  <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-muted/40 p-3 transition-all duration-200 hover:bg-muted">
    <div className="flex-shrink-0 rounded-lg bg-primary p-2 shadow-sm">
      <Icon className="h-4 w-4 text-primary-foreground" />
    </div>
    <div className="flex flex-col min-w-0 flex-1">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="text-sm font-semibold text-foreground">
        {value || "Not provided"}
      </span>
    </div>
  </div>
);

const Overview = ({ patient }: { patient: Patient }) => {
  return (
    <div className="grid grid-cols-1 gap-6">
      <Card className="gap-2 rounded-3xl border border-border/60 bg-white/80 px-0 py-3 shadow-sm backdrop-blur transition-all duration-300 hover:shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-lg font-bold text-foreground">
            <div className="rounded-lg bg-primary p-2">
              <Users className="h-5 w-5 text-primary-foreground" />
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
