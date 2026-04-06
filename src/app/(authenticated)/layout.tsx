import { getServerSession } from "next-auth";
import authOptions from "../api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";
import Toolbar from "@/components/Toolbar";
import BottomNavbar from "@/components/BottomNavbar";
import { MAINTENANCE_MODE } from "@/constants";
import { UserService } from "@/services/UserService";
import { isMember } from "@/utils/utils";
import MaintenancePage from "@/components/MaintenancePage";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  if (MAINTENANCE_MODE) {
    const user = await UserService.getMe(session.cannonToken);
    if (user && !isMember(user.role)) {
      return <MaintenancePage />;
    }
  }

  return (
    <div className="min-h-dvh text-white flex flex-col">
      <Toolbar />
      <div className="flex-1 bg-gray-100 text-black flex">
        {children}
      </div>
      <BottomNavbar />
    </div>
  );
}
