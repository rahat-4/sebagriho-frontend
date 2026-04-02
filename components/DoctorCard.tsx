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
  <p className="flex items-center gap-2 text-xs text-muted-foreground">
    <Icon className="h-4 w-4 shrink-0" />
    {text}
  </p>
);

const DoctorCard = () => {
  return (
    <Card className="group h-full overflow-hidden rounded-2xl border border-border/60 bg-white/80 shadow-sm backdrop-blur transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:gap-5">
        <div className="flex flex-row items-start gap-3 sm:flex-col sm:items-center">
          <div className="relative h-28 w-24 overflow-hidden rounded-2xl ring-1 ring-border/60">
            <Image src={UserImage} alt="Doctor" fill />
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span>4.5</span>
            <span className="text-amber-500">(272)</span>
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground font-ovo">Dr. John Doe</h2>
            <p className="text-xs text-muted-foreground font-ovo">
              MBBS, BCS (Health), DCH (Pediatrics)
            </p>
            <p className="mt-2 inline-flex rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary-darker ring-1 ring-secondary/20">
              Child Disease Specialist
            </p>
          </div>

          <div className="space-y-2">
            <InfoRow icon={BriefcaseMedical} text="12 years of experience" />
            <InfoRow
              icon={HospitalIcon}
              text="Dhaka Medical College and Hospital"
            />
            <InfoRow icon={CalendarClock} text="10:00 AM - 12:00 PM" />
          </div>
        </div>
      </div>

      <div className="border-t border-border/60 bg-muted/40 px-4 py-3 text-center">
        <p className="text-sm font-medium text-foreground">Appointment Fee: 500 BDT</p>
      </div>
    </Card>
  );
};

export default DoctorCard;
