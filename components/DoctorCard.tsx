import Image from "next/image";
import { Card } from "@/components/ui/card";
import UserImage from "@/public/user_image.jpg";
import {
  BriefcaseMedical,
  HospitalIcon,
  CalendarClock,
  Star,
  type LucideIcon,
} from "lucide-react";

// Reusable row component for icons + text
const InfoRow = ({ icon: Icon, text }: { icon: LucideIcon; text: string }) => (
  <p className="flex items-center text-xs">
    <Icon className="h-4 w-4 mr-1" />
    {text}
  </p>
);

const DoctorCard = () => {
  return (
    <Card className="max-w-[500px]">
      <div className="flex p-3">
        {/* Doctor Image + Rating */}
        <div className="mr-4 flex flex-col items-center">
          <div className="relative w-24 h-28 rounded overflow-hidden">
            <Image src={UserImage} alt="Doctor" fill />
          </div>
          <div className="bg-gray-200 mt-2 py-1 px-2 rounded text-xs font-semibold flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400" />
            <span>4.5</span>
            <span>(272)</span>
          </div>
        </div>

        {/* Doctor Details */}
        <div className="flex flex-col justify-between flex-1">
          <div>
            <h2 className="text-md font-semibold font-ovo">Dr. John Doe</h2>
            <p className="text-[11px] text-gray-500 font-ovo">
              MBBS, BCS (Health), DCH (Pediatrics)
            </p>
            <p className="bg-gray-200 text-xs rounded font-semibold mt-1 py-[2px] px-2 inline-block">
              Child Disease Specialist
            </p>
          </div>

          <div className="mt-3 space-y-1">
            <InfoRow icon={BriefcaseMedical} text="12 years of experience" />
            <InfoRow
              icon={HospitalIcon}
              text="Dhaka Medical College and Hospital"
            />
            <InfoRow icon={CalendarClock} text="10:00 AM - 12:00 PM" />
          </div>
        </div>
      </div>

      {/* Appointment Fee */}
      <div className="bg-gray-200 py-2 text-center rounded-b">
        <p className="text-sm font-medium">Appointment Fee: 500 BDT</p>
      </div>
    </Card>
  );
};

export default DoctorCard;
