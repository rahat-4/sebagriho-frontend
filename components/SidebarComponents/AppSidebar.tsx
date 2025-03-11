import {
  Hospital,
  LayoutDashboard,
  CalendarPlus2,
  BriefcaseMedical,
  User,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";

import UserNav from "./UserNav";

const userData = {
  name: "Mainul Rahat",
  phone: "+8801521507316",
  avatar: "@/public/user_image.jpg",
};

const SidebarData = [
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
    url: "/admin/patients",
  },
];

const AppSidebar = () => {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {SidebarData.map((item, index) => (
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
        <UserNav userData={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;
