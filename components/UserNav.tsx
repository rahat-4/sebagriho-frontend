import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const UserNav = ({
  userData,
}: {
  userData: { name: string; phone: string; avatar: string };
}) => {
  return (
    <Avatar className="h-12 w-12 rounded-full">
      <AvatarImage src={userData.avatar} alt={userData.name} />
      <AvatarFallback className="rounded-lg">MR</AvatarFallback>
    </Avatar>
  );
};

export default UserNav;
