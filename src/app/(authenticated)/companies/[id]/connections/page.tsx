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
    return <div>Company connections not found</div>;
  }

  return (
    <div className="container m-auto h-full">
      <List title="Company connections">
        {connections.map((u) => (
          <UserTile key={u.id} user={u} />
        ))}
      </List>
    </div>
  );
}
