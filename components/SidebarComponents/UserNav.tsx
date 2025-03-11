import { UserCircle2 } from "lucide-react";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

const UserNav = ({
  userData,
}: {
  userData: { name: string; phone: string; avatar: string };
}) => {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <SidebarMenuButton>
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={userData.avatar} alt={userData.name} />
              <AvatarFallback className="rounded-lg">MR</AvatarFallback>
            </Avatar>
          </SidebarMenuButton>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default UserNav;
