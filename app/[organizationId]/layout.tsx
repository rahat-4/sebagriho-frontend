"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

import { Pill, LayoutDashboard, User } from "lucide-react";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/SidebarComponents/AppSidebar";
import SiteHeader from "@/components/SidebarComponents/SiteHeader";

import { beautifyTitle } from "@/components/Converter";

import SebagrihoLogo from "@/public/sebagriho_logo.png";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { organization } = useAuth();
  const path = usePathname();
  const segments = path.split("/").filter(Boolean);

  const displayTitle = segments.slice(1).map(beautifyTitle).join(" > ");

  const data = {
    navMain: [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        url: `/${organization?.uid}/dashboard`,
      },
      {
        title: "Patients",
        icon: User,
        url: `/${organization?.uid}/patients`,
      },
      // {
      //   title: "Appointments",
      //   icon: CalendarPlus2,
      //   url: `${organization?.uid}/appointments`,
      // },
      {
        title: "Medicines",
        icon: Pill,
        url: `/${organization?.uid}/medicines`,
      },
    ],
  };

  const company = organization
    ? {
        name: organization.name,
        logo: organization.logo?.url,
        title: organization.title,
      }
    : {
        name: "Sebagriho",
        logo: SebagrihoLogo.src,
        title: "Healthcare everywhere",
      };

  return (
    <SidebarProvider>
      <AppSidebar data={data} company={company} />
      <SidebarInset>
        <SiteHeader displayTitle={displayTitle} />

        <main className="">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
