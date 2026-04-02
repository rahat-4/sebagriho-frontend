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
    return (
      <div className="flex min-h-svh items-center justify-center px-4 text-sm text-muted-foreground">
        Loading workspace...
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-svh w-full bg-[radial-gradient(circle_at_top_left,_rgba(42,183,202,0.12),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(32,80,114,0.1),_transparent_28%)]">
        <AppSidebar data={data} company={company} />
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
