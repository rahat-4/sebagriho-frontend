"use client";

import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

const beautifyTitle = (segment: string) =>
  segment.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const SiteHeader = () => {
  const path = usePathname();
  const segments = path.split("/").filter(Boolean);

  // remove known prefixes like 'admin'
  const filtered = segments.filter((seg) => seg !== "admin");

  const displayTitle = filtered
    .slice(-2) // take last 2 segments
    .map(beautifyTitle)
    .join(" > ");

  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <p className="text-base font-semibold tracking-wide">{displayTitle}</p>
      </div>
    </header>
  );
};

export default SiteHeader;
