import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserService } from "@/services/UserService";
import { getServerSession } from "next-auth";
import {
  HiOutlineHome,
  HiOutlineCalendar,
  HiOutlineUser,
  HiOutlineUserGroup,
  HiOutlineOfficeBuilding,
} from "react-icons/hi";
import UserSignOut from "./UserSignOut";
import { convertToAppRole } from "@/utils/utils";
import Link from "next/link";
import { HiOutlineQrCode } from "react-icons/hi2";

// to add a new bottom navbar item, just add the item details to "navbarItems" and
// add the item key to the appropriate roles in "navbarItemKeysByRole"

const navbarItems = {
  home: {
    name: "Home",
    icon: HiOutlineHome,
    route: "/home",
  },
  schedule: {
    name: "Schedule",
    icon: HiOutlineCalendar,
    route: "/schedule",
  },
  profile: {
    name: "Profile",
    icon: HiOutlineUser,
    route: "/profile",
  },
  connections: {
    name: "Connections",
    icon: HiOutlineUserGroup,
    route: "/connections",
  },
  companies: {
    name: "Companies",
    icon: HiOutlineOfficeBuilding,
    route: "/companies",
  },
};

type NavbarItemKey = keyof typeof navbarItems;

const navbarItemKeysByRole: Record<UserRole, NavbarItemKey[]> = {
  Attendee: ["home", "schedule", "profile"],
  Company: ["home", "connections", "profile"],
  Member: ["home", "schedule", "companies", "profile"],
  Admin: ["home", "schedule", "companies", "profile"],
};

export default async function BottomNavbar() {
  const session = await getServerSession(authOptions);

  const user: User | null = await UserService.getMe(session!.cannonToken);
  if (!user) return <UserSignOut />;

  return (
    <div className="flex flex-row justify-between pb-2 pt-3 px-5 relative">
      {navbarItemKeysByRole[convertToAppRole(user.role)].map((k) => {
        const { name, icon: Icon, route } = navbarItems[k];
        return (
          <Link href={route} className="flex flex-col gap-1 items-center">
            <Icon size={36} className="stroke-1" />
            <span className="text-xs">{name}</span>
          </Link>
        );
      })}
      <Link
        href={"/qr"}
        className="absolute -top-20 right-4 p-4 rounded-full bg-blue-dark"
      >
        <HiOutlineQrCode size={36} />
      </Link>
    </div>
  );
}
