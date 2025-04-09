import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { Plus, Search } from "lucide-react";

import DoctorCardList from "@/components/DoctorCardList";

const Page = () => {
  return (
    <div className="space-y-4">
      {/* Responsive Row for Add + Search */}
      <div className="space-y-2 md:space-y-0 md:flex md:items-end md:gap-4">
        {/* Search Field */}
        <div className="flex-1">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Input
              id="search"
              placeholder="Search for a Doctor"
              className="w-full text-sm pr-10"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4 pointer-events-none" />
          </div>
        </div>

        {/* Add Doctor Button */}
        <div className="w-full md:w-auto">
          <Button className="w-full md:w-auto flex items-center justify-center mt-1 md:mt-0">
            <Plus className="h-4 w-4 mr-1" />
            Add Doctor
          </Button>
        </div>
      </div>

      {/* Doctor List */}
      <DoctorCardList />
    </div>
  );
};

export default Page;
