import { useAuth } from "@/context/AuthContext";

import { ChevronsUpDown, LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import UserImage from "@/public/user_image.jpg";

const UserNav = () => {
  const { isMobile } = useSidebar();
  const { isLoading, logout, user } = useAuth();

  if (isLoading) {
    return <div className="h-12 animate-pulse rounded-2xl bg-sidebar-accent/60" />;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="h-auto cursor-pointer gap-3 rounded-2xl border border-sidebar-border/70 bg-sidebar-accent/60 px-3 py-3 text-left shadow-sm transition hover:bg-sidebar-accent data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-9 w-9 rounded-xl ring-1 ring-border/60">
                <AvatarImage src={user?.avatar || undefined} alt={user?.name} />
                <AvatarFallback className="rounded-xl bg-primary/10 text-primary">
                  <AvatarImage src={UserImage.src} alt={user?.name} />
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-sidebar-foreground">{user?.name}</span>
                <span className="truncate text-xs text-sidebar-foreground/70">{user?.phone}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-2xl border-border/60 shadow-xl"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-3 px-3 py-3 text-left text-sm">
                <Avatar className="h-9 w-9 rounded-xl">
                  <AvatarImage
                    src={user?.avatar || undefined}
                    alt={user?.name}
                  />
                  <AvatarFallback className="rounded-xl bg-primary/10 text-primary">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user?.name}</span>
                  <span className="truncate text-xs">{user?.phone}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="cursor-pointer">
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default UserNav;
