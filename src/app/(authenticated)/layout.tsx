import { getServerSession } from "next-auth";
import authOptions from "../api/auth/[...nextauth]/authOptions";
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
    <div className="min-h-screen text-white flex flex-col">
      <Toolbar />
      <div className="flex-1 bg-gray-100 text-black pb-navbar flex flex-col">{children}</div>
      <BottomNavbar />
    </div>
  );
}
