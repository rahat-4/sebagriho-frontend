import Image from "next/image";
import { Card } from "@/components/ui/card";
import UserImage from "@/public/user_image.jpg";
import {
  BriefcaseMedical,
  HospitalIcon,
  CalendarClock,
  Star,
} from "lucide-react";

const DoctorCard = () => {
  return (
    <Card className="max-w-[500px]">
      <div className="flex p-1">
        {/* Doctor Image + Rating */}
        <div className="mr-4">
          <div className="relative w-24 h-28 rounded overflow-hidden">
            <Image src={UserImage} alt="Doctor" fill />
          </div>
          <div className="bg-gray-200 mt-1 py-1 text-center text-xs font-semibold flex items-center justify-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400" />
            <span>4.5</span>
            <span>(272)</span>
          </div>
        </div>

        {/* Doctor Details */}
        <div className="flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold font-ovo">Dr. John Doe</h2>
            <p className="text-[11px] text-gray-500 font-ovo">
              MBBS, BCS (Health), DCH (Pediatrics)
            </p>
            <p className="bg-gray-200 text-xs rounded font-semibold mt-1 py-[2px] text-center">
              Child Disease Specialist
            </p>
          </div>

          <div className="mt-2 space-y-1 text-xs">
            <p className="flex items-center">
              <BriefcaseMedical className="h-4 w-4 mr-1" />
              12 years of experience
            </p>
            <p className="flex items-center">
              <HospitalIcon className="h-4 w-4 mr-1" />
              Dhaka Medical College and Hospital
            </p>
            <p className="flex items-center">
              <CalendarClock className="h-4 w-4 mr-1" />
              10:00 AM - 12:00 PM
            </p>
          </div>
        </div>
      </div>

      {/* Appointment Fee */}
      <div className="bg-gray-200 py-1 text-center rounded">
        <p className="text-sm font-medium">Appointment Fee: 500 BDT</p>
      </div>
    </Card>
  );
};

export default DoctorCard;
