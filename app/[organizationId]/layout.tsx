"use client";

import { useAuth } from "@/context/AuthContext";

import { Pill, LayoutDashboard, User, CalendarPlus2 } from "lucide-react";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/SidebarComponents/AppSidebar";
import SiteHeader from "@/components/SidebarComponents/SiteHeader";

import SebagrihoLogo from "@/public/sebagriho_logo.png";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { isLoading, organization } = useAuth();

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
      {
        title: "Appointments",
        icon: CalendarPlus2,
        url: `/${organization?.uid}/appointments`,
      },
      {
        title: "Medicines",
        icon: Pill,
        url: `/${organization?.uid}/medicines`,
      },
    ],
  };

  const company = organization && {
    name: organization.name,
    logo:
      typeof organization.logo === "string"
        ? organization.logo
        : organization.logo?.url || SebagrihoLogo.src,
    title: organization.title,
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <SidebarProvider>
      <AppSidebar data={data} company={company} />
      <SidebarInset>
        <SiteHeader />

        <main className="">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
