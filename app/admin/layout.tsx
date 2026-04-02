"use client";

import {
  Hospital,
  LayoutDashboard,
  CalendarPlus2,
  BriefcaseMedical,
  User,
} from "lucide-react";

import UserImage from "@/public/user_image.jpg";
import SebagrihoLogo from "@/public/sebagriho_logo.png";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

import AppSidebar from "@/components/SidebarComponents/AppSidebar";

import SiteHeader from "@/components/SidebarComponents/SiteHeader";

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
  return (
    <SidebarProvider>
      <div className="flex min-h-svh w-full bg-[radial-gradient(circle_at_top_left,_rgba(42,183,202,0.12),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(32,80,114,0.1),_transparent_28%)]">
        <AppSidebar data={data} company={data.company} />
        <SidebarInset className="flex-1 bg-transparent">
          <SiteHeader />

          <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
