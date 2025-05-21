"use client";

import {
  Hospital,
  LayoutDashboard,
  CalendarPlus2,
  BriefcaseMedical,
  User,
} from "lucide-react";

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

import UserImage from "@/public/user_image.jpg";
import SebagrihoLogo from "@/public/sebagriho_logo.png";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: UserImage.src,
  },
  company: {
    name: "Sebagriho",
    logo: SebagrihoLogo.src,
    plan: "Healthcare Everywhere",
  },
  navMain: [
    {
      title: "Organizations",
      icon: Hospital,
      url: "/admin/organizations",
    },
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      url: "/admin/dashboard",
    },
    {
      title: "Appointments",
      icon: CalendarPlus2,
      url: "/admin/appointments",
    },
    {
      title: "Doctors",
      icon: BriefcaseMedical,
      url: "/admin/doctors",
    },
    {
      title: "Patients",
      icon: User,
      url: "/patients",
    },
  ],
};

const AppSidebar = () => {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <TeamSwitcher company={data.company} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item, index) => (
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
        <UserNav user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;
