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
import { ExternalLinkIcon, Scan } from "lucide-react";
import Link from "next/link";
import BlankPageWithMessage from "@/components/BlankPageMessage";
import ConnectionTile from "@/components/user/ConnectionTile";
import DownloadCVs from "@/components/company/DownloadCVs";

interface CompanyParams {
  id: string;
}

const N_CONNECTIONS = 3;

export default async function Company({ params }: { params: CompanyParams }) {
  const { id: companyID } = params;

  const company = await CompanyService.getCompany(companyID);

  if (!company) {
    return <BlankPageWithMessage message="Company not found!" />;
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

  const session = (await getServerSession(authOptions))!;
  const user: User | null = await UserService.getMe(session!.cannonToken);

  const companyConnections = await CompanyService.getConnections(
    session.cannonToken,
    companyID,
  );

  const downloadCVsLinks =
    user &&
    ((isCompany(user.role) &&
      !!user.company?.length &&
      user.company[0].company === companyID) ||
      isMember(user.role)) &&
    (await CompanyService.getDownloadLinks(session.cannonToken, companyID));

  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center gap-y-3 p-4 text-center">
        <div className="flex justify-center gap-1.5">
          <h2 className="text-2xl font-bold">{company.name}</h2>
          {company.site && (
            <Link href={company.site} target="blank">
              <ExternalLinkIcon size={16} className="text-blue-600" />
            </Link>
          )}
        </div>
        <Image
          className="w-40 h-40 object-contain"
          width={150}
          height={150}
          src={company.img}
          alt={`${company.name} logo`}
        />
        {hereToday && (
          <span className="bg-sinfo-secondary text-white rounded-md px-3 py-1 text-lg font-bold uppercase">
            Here Today
          </span>
        )}
      </div>

      {/* Download CVs */}
      {downloadCVsLinks && <DownloadCVs links={downloadCVsLinks} />}

      {/* Members section */}
      {user && isMember(user.role) && (
        <div className="flex justify-center items-center p-4 gap-2">
          <Link
            className="button button-primary text-sm flex-1"
            href={`/companies/${companyID}/promote`}
          >
            <Scan size={16} />
            Promote
          </Link>
        </div>
      )}
      {/* Days at the event */}
      {companyStands?.length ? (
        <GridList
          title="Days at the venue"
          description="When we will be at SINFO"
        >
          {companyStands.map((s) => (
            <Link
              key={s.date}
              href={`/venue?day=${s.date.split("T")[0]}&company=${companyID}`}
            >
              <EventDayButton date={s.date} />
            </Link>
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
      {user && isCompany(user.role) && !!companyConnections?.length && (
        <List
          title="Company connections"
          link={`/companies/${companyID}/connections`}
          linkText="See all"
        >
          {companyConnections.slice(0, N_CONNECTIONS).map((c) => (
            <ConnectionTile key={c.to} connection={c} />
          ))}
        </List>
      )}
    </div>
  );
}
