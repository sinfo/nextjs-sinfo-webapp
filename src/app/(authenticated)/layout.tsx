import { getServerSession } from "next-auth";
import authOptions from "../api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";
import Toolbar from "@/components/Toolbar";
import BottomNavbar from "@/components/BottomNavbar";
import { MAINTENANCE_MODE } from "@/constants";
import { UserService } from "@/services/UserService";
import { isMember } from "@/utils/utils";
import MaintenancePage from "@/components/MaintenancePage";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { getServerFavorites } from "@/utils/favorites.server";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const user = await UserService.getMe(session.cannonToken);

  if (MAINTENANCE_MODE) {
    if (user && !isMember(user.role)) {
      return <MaintenancePage />;
    }
  }

  const userId = user?.id || session.user?.email || "user";
  const initialFavorites =
    user?.favoriteSpeakers && user.favoriteSpeakers.length > 0
      ? user.favoriteSpeakers
      : getServerFavorites(userId);

  return (
    <FavoritesProvider userId={userId} initialFavorites={initialFavorites}>
      <div className="min-h-dvh text-white flex flex-col">
        <Toolbar role={user?.role} />
        <div className="flex-1 bg-gray-100 text-black flex">{children}</div>
        <BottomNavbar />
      </div>
    </FavoritesProvider>
  );
}
