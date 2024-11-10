import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { UserService } from "@/services/UserService";
import Topbar from "@/components/Topbar";
import BottomNavbar from "@/components/BottomNavbar";
import UserSignOut from "@/components/UserSignOut";
import { HiOutlineQrCode } from "react-icons/hi2";
import Link from "next/link";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const fetchUser: User = await UserService.getMe(session!.cannonToken);
  if (!fetchUser) return <UserSignOut />;
  
  return (
    <div className="h-screen bg-cloudy text-white flex flex-col">
      <Topbar user={fetchUser} />
      <div className="flex-1 relative">
        {children}
        <Link
          href={"/qr"}
          className="absolute bottom-4 right-4 p-4 rounded-full bg-blue-dark"
        >
          <HiOutlineQrCode size={36} />
        </Link>
      </div>
      <BottomNavbar />
    </div>
  );
}
