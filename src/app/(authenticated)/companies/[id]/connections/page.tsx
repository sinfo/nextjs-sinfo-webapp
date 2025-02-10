import authOptions from "@/app/api/auth/[...nextauth]/authOptions";
import BlankPageWithMessage from "@/components/BlankPageMessage";
import List from "@/components/List";
import ConnectionTile from "@/components/user/ConnectionTile";
import { CompanyService } from "@/services/CompanyService";
import { UserService } from "@/services/UserService";
import { getServerSession } from "next-auth";

interface CompanyConnectionsParams {
  id: string;
}

export default async function CompanyConnections({
  params,
}: {
  params: CompanyConnectionsParams;
}) {
  const { id: companyID } = params;

  const session = (await getServerSession(authOptions))!;

  const connections = await CompanyService.getConnections(
    session.cannonToken,
    companyID,
  );
  if (!connections) {
    return <BlankPageWithMessage message="Company connections not found!" />;
  }

  const connectionsByUser = connections.reduce(
    (acc, c) => ({ ...acc, [c.from]: [...(acc[c.from] ?? []), c] }),
    {} as Record<string, Connection[]>,
  );
  const users = (
    await Promise.all(
      Object.keys(connectionsByUser).map((id) =>
        UserService.getUser(session.cannonToken, id),
      ),
    )
  ).sort((a, b) => a!.name.localeCompare(b!.name));

  return (
    <div className="container mx-auto">
      {users.map(
        (u) =>
          u && (
            <List key={u.id} title={`${u.name}&apos;s connections`}>
              {connectionsByUser[u.id].map((c) => (
                <ConnectionTile key={c.to} connection={c} />
              ))}
            </List>
          ),
      )}
    </div>
  );
}
