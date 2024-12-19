import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Toolbar from "@/components/Toolbar";
import BottomNavbar from "@/components/BottomNavbar";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div className="h-screen bg-blue-gradient text-white flex flex-col">
      <Toolbar />
      <div className="flex-1 overflow-y-auto bg-gray-100 text-black">
        {children}
      </div>
      <BottomNavbar />
    </div>
  );
}
