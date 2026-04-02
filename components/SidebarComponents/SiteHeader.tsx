import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

const SiteHeader = () => {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center border-b border-border/60 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70 transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-3 px-4 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-1 h-5 data-[orientation=vertical]:h-4"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold tracking-wide text-foreground">
            Sebagriho workspace
          </p>
          <p className="truncate text-xs text-muted-foreground">
            Manage organizations, appointments, medicines, and patients
          </p>
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;
