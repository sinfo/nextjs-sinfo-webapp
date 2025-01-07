import authOptions from "@/app/api/auth/[...nextauth]/authOptions";
import { UserService } from "@/services/UserService";
import { getServerSession } from "next-auth";
import { convertToAppRole } from "@/utils/utils";
import Link from "next/link";
import NavbarItem, { NavbarItemKey } from "./NavbarItem";
import { QrCode } from "lucide-react";

// to add a new bottom navbar item, just add the item details to "navbarItems"
// and add the item key to the appropriate roles in "navbarItemKeysByRole"

const navbarItemKeysByRole: Record<UserRole, NavbarItemKey[]> = {
  Attendee: ["home", "schedule", "profile"],
  Company: ["home", "connections", "profile"],
  Member: ["home", "schedule", "companies", "profile"],
  Admin: ["home", "schedule", "companies", "profile"],
};

export default async function BottomNavbar() {
  const session = await getServerSession(authOptions);

  const user: User | null = await UserService.getMe(session!.cannonToken);
  if (!user) return <></>;

  return (
    <div className="container m-auto flex h-[70px] flex-row relative">
      {navbarItemKeysByRole[convertToAppRole(user.role)].map((k) => (
        <NavbarItem key={k} name={k} />
      ))}
      <Link
        href="/qr"
        className="absolute -top-16 right-4 p-4 rounded-full bg-blue-dark"
      >
        <QrCode size={24} />
      </Link>
    </div>
  );
}
