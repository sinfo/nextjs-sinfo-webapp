import authOptions from "@/app/api/auth/[...nextauth]/authOptions";
import List from "@/components/List";
import { UserTile } from "@/components/user/UserTile";
import { UserService } from "@/services/UserService";
import { getServerSession } from "next-auth";

export default async function Connections() {
  const session = await getServerSession(authOptions);
  const user: User | null = await UserService.getMe(session!.cannonToken);

  if (!user?.connections) {
    return <div>Connections not found.</div>;
  }

  return (
    <div className="container m-auto h-full text-black">
      <List title="Connections">
        {user.connections.map((u) => (
          <UserTile key={u.id} user={u} />
        ))}
      </List>
    </div>
  );
}
