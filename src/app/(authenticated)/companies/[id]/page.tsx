import authOptions from "@/app/api/auth/[...nextauth]/authOptions";
import GridList from "@/components/GridList";
import List from "@/components/List";
import ListCard from "@/components/ListCard";
import { CompanyService } from "@/services/CompanyService";
import { UserService } from "@/services/UserService";
import { isHereToday } from "@/utils/company";
import {
  convertToAppRole,
  generateTimeInterval,
  getEventDay,
  getEventFullDate,
  getEventMonth,
} from "@/utils/utils";
import { getServerSession } from "next-auth";
import Image from "next/image";
import StandDetails from "./StandDetails";

interface CompanyParams {
  id: string;
}

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
          <span className="bg-blue-dark text-white rounded-md px-3 py-1 text-lg font-bold uppercase">
            Here Today
          </span>
        )}
      </div>
      {/* Days at the event */}
      {companyStands?.length && (
        <GridList
          title="Days at the venue"
          description="When they will be here"
        >
          {companyStands.map((s) => (
            <div
              key={`stand-day-${s.date}-${s.id}`}
              className="flex flex-col items-center text-center gap-y-1 pt-4"
              title={getEventFullDate(s.date)}
            >
              <span className="flex items-center justify-center font-mono rounded-full w-10 h-10 bg-blue-dark text-white">
                {getEventDay(s.date)}
              </span>
              <span className="text-xs text-gray-500">
                {getEventMonth(s.date, true)}
              </span>
            </div>
          ))}
        </GridList>
      )}
      {/* Company Sessions */}
      {companySessions?.length && (
        <List title="Sessions">
          {companySessions.map((s) => (
            <ListCard
              key={s.id}
              title={s.name}
              headtext={generateTimeInterval(s.date, s.duration)}
              label={s.kind}
              link={`/sessions/${s.id}`}
            />
          ))}
        </List>
      )}
      {/* Company Members */}
      {companyMembers?.length && (
        <List title="Members" description="People who work here">
          {companyMembers.map((m) => (
            <ListCard key={m.id} title={m.name} img={m.img} subtitle={m.role} />
          ))}
        </List>
      )}
      {/* Stand Details */}
      {user &&
        convertToAppRole(user.role) === "Member" &&
        company.standDetails && (
          <StandDetails standDetails={company.standDetails} />
        )}
    </div>
  );
}
