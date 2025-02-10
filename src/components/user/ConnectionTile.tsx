import authOptions from "@/app/api/auth/[...nextauth]/authOptions";
import { UserService } from "@/services/UserService";
import { getServerSession } from "next-auth";
import { UserTile } from "./UserTile";

interface ConnectionTileProps {
  connection: Connection;
}

export default async function ConnectionTile({
  connection,
}: ConnectionTileProps) {
  const session = (await getServerSession(authOptions))!;

  const connectedUser = await UserService.getUser(
    session.cannonToken,
    connection.to,
  );

  if (!connectedUser) return <></>;
  return <UserTile user={connectedUser} />;
}
