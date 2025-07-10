import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Venus, Syringe, Users, MapPin } from "lucide-react";

import { Patient } from "./interface";

interface InfoItemProps {
  icon: React.ElementType;
  label: string;
  value: string | React.ReactNode;
  className?: string;
}

// Enhanced InfoItem component
const InfoItem = ({
  icon: Icon,
  label,
  value,
  className = "",
}: InfoItemProps) => (
  <div
    className={`flex justify-start items-center gap-2 p-1  rounded-xl  hover:shadow-sm transition-all duration-200 ${className}`}
  >
    <div className="flex flex-row gap-1 ">
      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-[5px] rounded-lg shadow-sm">
        <Icon className="h-3 w-3 text-white" />
      </div>
      <div className="text-slate-500 text-sm font-medium">{label}</div>
    </div>
    <div className="text-slate-900 text-sm font-semibold">{value}</div>
  </div>
);

const Overview = ({ patient }: { patient: Patient }) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Contact Information */}
      <Card className="gap-2 px-0 py-3 bg-white border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg">
              <Users className="h-3 w-3 text-white" />
            </div>
            General Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <InfoItem
            icon={Phone}
            label="Primary Phone: "
            value={patient.phone}
          />
          <InfoItem icon={Venus} label="Gender: " value={patient.gender} />
          <InfoItem icon={Venus} label="Age: " value={patient.age} />
          <InfoItem
            icon={Syringe}
            label="Blood Group: "
            value={patient.blood_group}
          />
          <InfoItem
            icon={Users}
            label="Emergency Contact: "
            value={patient.relative_phone}
          />
          <InfoItem icon={MapPin} label="Address: " value={patient.address} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Overview;
