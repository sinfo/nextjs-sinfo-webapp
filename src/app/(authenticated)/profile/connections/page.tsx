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
          <p className="text-gray-600">
            1. Scan the QR code of another user. <br />
            2. Visit their profile page.
            <br />
            3. Click on the "Connect" button.
            <br />
          </p>
        )}
      </List>
    </div>
  );
}
