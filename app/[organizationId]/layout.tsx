"use client";

import { useAuth } from "@/context/AuthContext";

import { usePathname } from "next/navigation";

import {
  Pill,
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

import { beautifyTitle } from "@/components/Converter";

import SiteHeader from "@/components/SidebarComponents/SiteHeader";
const data = {
  navMain: [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      url: "/admin/dashboard",
    },
    {
      title: "Patients",
      icon: User,
      url: "/[organizationId]/patients",
    },
    {
      title: "Appointments",
      icon: CalendarPlus2,
      url: "/admin/appointments",
    },
    {
      title: "Medicines",
      icon: Pill,
      url: "/[organizationId]/patients",
    },
  ],
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, organization } = useAuth();
  const path = usePathname();
  const segments = path.split("/").filter(Boolean);

  const displayTitle = segments.slice(1).map(beautifyTitle).join(" > ");

  const company = organization || {
    name: "Sebagriho",
    logo: SebagrihoLogo.src,
    title: "Healthcare Everywhere",
  };

  return (
    <SidebarProvider>
      <AppSidebar data={data} company={company} />
      <SidebarInset>
        <SiteHeader displayTitle={displayTitle} />

        <main className="flex-1 p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
