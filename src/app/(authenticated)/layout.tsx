import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Topbar from "@/components/Topbar";
import BottomNavbar from "@/components/BottomNavbar";
import { HiOutlineQrCode } from "react-icons/hi2";
import Link from "next/link";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div className="h-screen bg-cloudy text-white flex flex-col">
      <Topbar />
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
