import { SlidersHorizontal, ArrowDownUp } from "lucide-react";

import DoctorCardList from "@/components/DoctorCardList";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between">
      <div className="flex items-center justify-between w-full px-3 pb-[7px] pt-[3px] sticky top-16 z-10">
        <div className="bg-white border rounded items-center p-2">
          <SlidersHorizontal size={16} />
        </div>
        <div className="bg-white border rounded items-center p-1 w-full mx-1 text-center">
          Banner
        </div>
        <div className="bg-white border rounded items-center p-2">
          <ArrowDownUp size={16} />
        </div>
      </div>
      <DoctorCardList />
    </main>
  );
}
