import authOptions from "@/app/api/auth/[...nextauth]/authOptions";
import List from "@/components/List";
import { UserService } from "@/services/UserService";
import { getServerSession } from "next-auth";

export default async function Connections() {
  const session = await getServerSession(authOptions);
  const user: User | null = await UserService.getMe(session!.cannonToken);

  return (
    <div className="container m-auto h-full">
      <List title="Connections"></List>
    </div>
  );
}
