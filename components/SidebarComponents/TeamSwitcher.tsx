import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import Image from "next/image";

interface Company {
  logo: string;
  name: string;
  title?: string | null;
}

export function TeamSwitcher({ company }: { company: Company | null }) {
  if (!company) {
    return null;
  }
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="h-auto gap-3 rounded-2xl border border-sidebar-border/70 bg-sidebar-accent/70 px-3 py-3 text-left shadow-sm transition hover:bg-sidebar-accent data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-background/90 p-1.5 shadow-sm ring-1 ring-border/60">
            <Image src={company.logo} alt="logo" width={32} height={32} className="h-full w-full object-contain" />
          </div>
          <div className="grid flex-1 gap-0.5 text-left text-sm leading-tight">
            <span className="truncate font-semibold text-sidebar-foreground">{company.name}</span>
            <span className="truncate text-xs text-sidebar-foreground/70">{company.title}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
