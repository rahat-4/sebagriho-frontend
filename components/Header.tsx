import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { UserRoundSearch, CircleX } from "lucide-react";

import Image from "next/image";

import SebagrihoLogo from "@/public/sebagriho.png";

const Header = () => {
  return (
    <div className="flex items-center justify-between p-3 bg-white shadow-sm sticky top-0 z-10">
      <Image src={SebagrihoLogo} alt="Sebagriho Logo" width={120} />
      <Drawer direction="top">
        <DrawerTrigger>
          <Button variant="outline">
            Search Doctor <UserRoundSearch />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>
              Search Doctor
              <DrawerClose asChild>
                <CircleX className="absolute right-4 top-4 cursor-pointer" />
              </DrawerClose>
            </DrawerTitle>
            <DrawerDescription>
              Find doctors near you with advanced filters.
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4">
            <Input
              type="text"
              placeholder="Search by doctor's name"
              className="w-full mb-4"
            />
            <div className="flex gap-2 mb-4">
              <Input type="text" placeholder="Specialty" className="w-full" />
              <Input
                type="text"
                placeholder="Bangladesh"
                className="w-full"
                disabled
              />
            </div>
            <div className="flex gap-2 mb-4">
              <Input type="text" placeholder="City" className="w-full" />
              <Input type="text" placeholder="Thana" className="w-full" />
            </div>
            <div className="flex gap-2 mb-4">
              <Input type="text" placeholder="Gender" className="w-full" />
              <Input type="text" placeholder="Sort by" className="w-full" />
            </div>
          </div>
          <DrawerFooter>
            <div className="flex flex-row gap-2 w-full">
              <Button variant="outline" className="flex-1">
                Clear Filters
              </Button>
              <Button variant={"outline"} className="flex-1">
                Search
              </Button>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default Header;
