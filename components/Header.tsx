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

// Reusable input component
const FilterInput = ({ placeholder }: { placeholder: string }) => (
  <Input type="text" placeholder={placeholder} className="w-full text-xs" />
);

const Header = () => {
  return (
    <div className="flex items-center justify-between p-3 bg-white shadow-sm sticky top-0 z-10">
      <Image src={SebagrihoLogo} alt="Sebagriho Logo" width={120} />

      <Drawer direction="top">
        <DrawerTrigger>
          <Button variant="outline">
            Search Doctor <UserRoundSearch className="ml-2" />
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
            <FilterInput placeholder="Doctor's name" />
            <div className="flex gap-2 mb-2 mt-2">
              {["Speciality", "Gender"].map((ph) => (
                <FilterInput key={ph} placeholder={ph} />
              ))}
            </div>
            <div className="flex gap-2 mb-2">
              {["City", "Thana"].map((ph) => (
                <FilterInput key={ph} placeholder={ph} />
              ))}
            </div>
          </div>

          <DrawerFooter>
            <div className="flex gap-2 w-full">
              <Button variant="outline" className="flex-1">
                Clear
              </Button>
              <Button variant="outline" className="flex-1">
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
