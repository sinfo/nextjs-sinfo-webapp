import authOptions from "@/app/api/auth/[...nextauth]/authOptions";
import { UserService } from "@/services/UserService";
import { getServerSession } from "next-auth";
import { convertToAppRole } from "@/utils/utils";
import NavbarItem, { NavbarItemKey } from "./NavbarItem";
import QRCodeButton from "./QRCodeButton";

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
    <div className="sticky z-10 bottom-0 left-0 right-0 bg-sinfo-primary">
      <div className="relative container mx-auto flex h-navbar flex-row">
        {navbarItemKeysByRole[convertToAppRole(user.role)].map((k) => (
          <NavbarItem key={k} name={k} />
        ))}
        <QRCodeButton />
      </div>
    </div>
  );
}
