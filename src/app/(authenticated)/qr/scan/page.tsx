import { getServerSession } from "next-auth";
import QRScanner from "./QRScanner";
import UserSignOut from "@/components/UserSignOut";
import { UserService } from "@/services/UserService";
import authOptions from "@/app/api/auth/[...nextauth]/authOptions";

export default async function ScanQRCode() {
  const session = await getServerSession(authOptions);

  const user: User | null = await UserService.getMe(session?.cannonToken ?? "");
  if (!user) return <UserSignOut />;

  return (
    <div className="container m-auto h-full">
      <QRScanner user={user} cannonToken={session!.cannonToken} />
    </div>
  );
}
