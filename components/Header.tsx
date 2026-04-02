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

const FilterInput = ({ placeholder }: { placeholder: string }) => (
  <Input
    type="text"
    placeholder={placeholder}
    className="h-10 w-full rounded-xl border-border/60 text-sm"
  />
);

const Header = () => {
  return (
    <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-white/90 p-3 shadow-sm backdrop-blur">
      <Image src={SebagrihoLogo} alt="Sebagriho Logo" width={120} />

      <Drawer direction="top">
        <DrawerTrigger asChild>
          <Button variant="outline" className="rounded-xl border-border/60">
            Search Doctor <UserRoundSearch className="ml-2" />
          </Button>
        </DrawerTrigger>

        <DrawerContent className="rounded-b-3xl border-border/60">
          <DrawerHeader className="relative">
            <DrawerTitle className="text-foreground">
              Search Doctor
              <DrawerClose asChild>
                <CircleX className="absolute right-4 top-4 cursor-pointer text-muted-foreground" />
              </DrawerClose>
            </DrawerTitle>
            <DrawerDescription className="text-muted-foreground">
              Find doctors near you with advanced filters.
            </DrawerDescription>
          </DrawerHeader>

          <div className="space-y-3 px-4 pb-2">
            <FilterInput placeholder="Doctor's name" />
            <div className="flex gap-2">
              {["Speciality", "Gender"].map((ph) => (
                <FilterInput key={ph} placeholder={ph} />
              ))}
            </div>
            <div className="flex gap-2">
              {["City", "Thana"].map((ph) => (
                <FilterInput key={ph} placeholder={ph} />
              ))}
            </div>
          </div>

          <DrawerFooter className="border-t border-border/60">
            <div className="flex gap-2 w-full">
              <Button variant="outline" className="flex-1 rounded-xl border-border/60">
                Clear
              </Button>
              <Button variant="outline" className="flex-1 rounded-xl border-border/60">
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
