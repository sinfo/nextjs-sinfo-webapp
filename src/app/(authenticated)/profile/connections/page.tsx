import authOptions from "@/app/api/auth/[...nextauth]/authOptions";
import BlankPageWithMessage from "@/components/BlankPageMessage";
import List from "@/components/List";
import ConnectionTile from "@/components/user/ConnectionTile";
import { UserService } from "@/services/UserService";
import { getServerSession } from "next-auth";

export default async function Connections() {
  const session = (await getServerSession(authOptions))!;

  const connections = await UserService.getConnections(session.cannonToken);
  if (!connections) {
    return <BlankPageWithMessage message="Connections not found!" />;
  }

  return (
    <div className="container mx-auto">
      <List title="Connections">
        {connections.length > 0 ? (
          connections.map((c) => <ConnectionTile key={c.to} connection={c} />)
        ) : (
          <div>
            <p>1. Scan other user&apos;s QR-Code.</p>
            <p>2. Open user&apos;s page.</p>
            <p>3. And click on the connect button.</p>
          </div>
        )}
      </List>
    </div>
  );
}
