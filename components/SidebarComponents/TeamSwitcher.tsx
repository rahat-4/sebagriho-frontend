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
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-white border text-sidebar-primary-foreground">
            <Image src={company.logo} alt="logo" width={28} height={28} />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{company.name}</span>
            <span className="truncate text-xs">{company.title}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
