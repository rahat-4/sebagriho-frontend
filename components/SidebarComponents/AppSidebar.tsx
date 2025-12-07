import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";

import { TeamSwitcher } from "./TeamSwitcher";
import UserNav from "./UserNav";
import type { LucideIcon } from "lucide-react";

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

interface SidebarData {
  navMain: NavItem[];
}

interface Company {
  logo: string;
  name: string;
  title?: string | null;
}

const AppSidebar = ({
  data,
  company,
}: {
  data: SidebarData;
  company: Company | null;
}) => {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <TeamSwitcher company={company} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item, index: number) => (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton asChild>
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <UserNav />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;
