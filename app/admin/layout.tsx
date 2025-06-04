"use client";

import { usePathname } from "next/navigation";
// import { useAuth } from "@/context/AuthContext";
import {
  Hospital,
  LayoutDashboard,
  CalendarPlus2,
  BriefcaseMedical,
  User,
} from "lucide-react";

import UserImage from "@/public/user_image.jpg";
import SebagrihoLogo from "@/public/sebagriho_logo.png";

import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import AppSidebar from "@/components/SidebarComponents/AppSidebar";

import SiteHeader from "@/components/SidebarComponents/SiteHeader";

import { beautifyTitle } from "@/components/Converter";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: UserImage.src,
  },
  company: {
    name: "Sebagriho",
    logo: SebagrihoLogo.src,
    title: "Healthcare Everywhere",
  },
  navMain: [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      url: "/admin/dashboard",
    },
    {
      title: "Organizations",
      icon: Hospital,
      url: "/admin/organizations",
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

const Layout = ({ children }: { children: React.ReactNode }) => {
  // const { organization } = useAuth();
  const path = usePathname();
  const segments = path.split("/").filter(Boolean);

  const displayTitle = segments.slice(1).map(beautifyTitle).join(" > ");
  return (
    <SidebarProvider>
      <AppSidebar data={data} company={data.company} />
      <SidebarInset>
        <SiteHeader displayTitle={displayTitle} />

        <main className="flex-1 p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
