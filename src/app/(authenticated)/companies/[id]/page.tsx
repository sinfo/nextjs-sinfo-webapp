import authOptions from "@/app/api/auth/[...nextauth]/authOptions";
import GridList from "@/components/GridList";
import List from "@/components/List";
import { CompanyService } from "@/services/CompanyService";
import { UserService } from "@/services/UserService";
import { isHereToday } from "@/utils/company";
import { isCompany, isMember } from "@/utils/utils";
import { getServerSession } from "next-auth";
import Image from "next/image";
import StandDetails from "./StandDetails";
import { UserTile } from "@/components/user/UserTile";
import { SessionTile } from "@/components/session";
import EventDayButton from "@/components/EventDayButton";

interface CompanyParams {
  id: string;
}

const N_CONNECTIONS = 3;

export default async function Company({ params }: { params: CompanyParams }) {
  const { id: companyID } = params;

  const company = await CompanyService.getCompany(companyID);

  if (!company) {
    return <div>Company not found</div>;
  }

  const companySessions = company.sessions?.sort((a, b) =>
    a.date.localeCompare(b.date),
  );
  const companyMembers = company.members?.sort((a, b) =>
    a.name.localeCompare(b.name),
  );
  const companyStands = company.stands?.sort((a, b) =>
    a.date.localeCompare(b.date),
  );
  const hereToday = isHereToday(company);

  const session = await getServerSession(authOptions);
  const user: User | null = await UserService.getMe(session!.cannonToken);

  const companyConnections = await CompanyService.getConnections(companyID);

  return (
    <div className="container m-auto h-full text-black">
      <div className="flex flex-col items-center gap-y-2 p-4 text-center">
        <h2 className="text-2xl font-bold">{company.name}</h2>
        <Image
          className="w-40 h-40 object-contain"
          width={150}
          height={150}
          src={company.img}
          alt={`${company.name} logo`}
        />
        {/* TODO: Add contacts to company */}
        {hereToday && (
          <span className="bg-sinfo-primary text-white rounded-md px-3 py-1 text-lg font-bold uppercase">
            Here Today
          </span>
        )}
      </div>
      {/* Days at the event */}
      {companyStands?.length ? (
        <GridList
          title="Days at the venue"
          description="When we will be at SINFO"
        >
          {companyStands.map((s) => (
            <EventDayButton key={s.date} date={s.date} selected={true} />
          ))}
        </GridList>
      ) : (
        <></>
      )}
      {/* Company Sessions */}
      {companySessions?.length ? (
        <List title="Sessions">
          {companySessions.map((s) => (
            <SessionTile key={s.id} session={s} />
          ))}
        </List>
      ) : (
        <></>
      )}
      {/* Company Members */}
      {companyMembers?.length ? (
        <List title="Members" description="People who work here">
          {companyMembers.map((u) => (
            <UserTile key={u.id} user={u} />
          ))}
        </List>
      ) : (
        <></>
      )}
      {/* Stand Details */}
      {user && isMember(user.role) && company.standDetails && (
        <StandDetails standDetails={company.standDetails} />
      )}
      {/* Connections */}
      {user &&
        (isCompany(user.role) || isMember(user.role)) &&
        companyConnections && (
          <List
            title="Company connections"
            link={`/companies/${companyID}/connections`}
            linkText="See all"
          >
            {companyConnections.slice(0, N_CONNECTIONS).map((u) => (
              <UserTile key={u.id} user={u} />
            ))}
          </List>
        )}
    </div>
  );
}
