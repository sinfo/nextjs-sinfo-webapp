import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";

import UserSignOut from "@/components/UserSignOut";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserService } from "@/services/UserService";

import ClientBottomNavbar from "./ClientBottomNavbar";

export default async function BottomNavbar() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const user: User = await UserService.getMe(session.cannonToken);
  if (!user) return <UserSignOut />;
  
  return (
    <ClientBottomNavbar user={user} ></ClientBottomNavbar>
  );
}
