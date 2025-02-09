import BlankPageWithMessage from "@/components/BlankPageMessage";
import List from "@/components/List";
import { UserTile } from "@/components/user/UserTile";
import { CompanyService } from "@/services/CompanyService";

interface CompanyConnectionsParams {
  id: string;
}

export default async function CompanyConnections({
  params,
}: {
  params: CompanyConnectionsParams;
}) {
  const { id: companyID } = params;

  const connections = await CompanyService.getConnections(companyID);

  if (!connections) {
    return <BlankPageWithMessage message="Company connections not found!" />;
  }

  return (
    <div className="container mx-auto">
      <List title="Company connections">
        {connections.map((u) => (
          <UserTile key={u.id} user={u} />
        ))}
      </List>
    </div>
  );
}
