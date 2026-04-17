import authOptions from "@/app/api/auth/[...nextauth]/authOptions";
import BlankPageWithMessage from "@/components/BlankPageMessage";
import GridList from "@/components/GridList";
import List from "@/components/List";
import ListCard from "@/components/ListCard";
import { SessionTile } from "@/components/session";
import UserSignOut from "@/components/UserSignOut";
import { AchievementService } from "@/services/AchievementService";
import { CompanyService } from "@/services/CompanyService";
import { SessionService } from "@/services/SessionService";
import { UserService } from "@/services/UserService";
import { Building2, CalendarDays, Handshake, Trophy } from "lucide-react";
import { getServerSession } from "next-auth";

function uniqueCompanyIds(user: User) {
  const companyIds =
    user.signatures
      ?.flatMap((signatureDay) =>
        signatureDay.signatures.map((signature) => signature.companyId),
      )
      .filter((companyId): companyId is string => !!companyId) ?? [];

  return companyIds.reduce((uniqueIds: string[], companyId) => {
    if (!uniqueIds.includes(companyId)) {
      uniqueIds.push(companyId);
    }
    return uniqueIds;
  }, []);
}

const sessionAchievementKinds: AchievementKind[] = [
  "session",
  "presentation",
  "workshop",
  "keynote",
];

export default async function ProfileStatistics() {
  const session = (await getServerSession(authOptions))!;
  const user = await UserService.getMe(session.cannonToken);
  if (!user) return <UserSignOut />;

  const [achievements, sessions, companies, connectionsResponse] =
    await Promise.all([
      AchievementService.getAchievements(),
      SessionService.getSessions(),
      CompanyService.getCompanies(),
      UserService.getConnections(session.cannonToken),
    ]);

  if (!achievements) {
    return <BlankPageWithMessage message="Statistics are not available." />;
  }

  const visitedCompanyIds = uniqueCompanyIds(user);
  const visitedCompanies = companies
    ?.filter((company) => visitedCompanyIds.includes(company.id))
    .sort((a, b) => a.name.localeCompare(b.name));
  const attendedSessionAchievements = achievements.filter(
    (achievement) =>
      sessionAchievementKinds.includes(achievement.kind) &&
      achievement.users?.includes(user.id),
  );
  const attendedSessions = (sessions ?? []).filter((sessionItem) =>
    attendedSessionAchievements.some(
      (achievement) =>
        achievement.session?.id === sessionItem.id ||
        achievement.name === sessionItem.name,
    ),
  );
  const earnedAchievements = achievements.filter((achievement) =>
    achievement.users?.includes(user.id),
  );
  const totalSignatureEntries =
    user.signatures?.reduce(
      (count, signatureDay) => count + signatureDay.signatures.length,
      0,
    ) ?? 0;
  const totalConnections = connectionsResponse?.connections.length ?? 0;

  const statisticCards = [
    {
      title: "Companies visited",
      value: visitedCompanyIds.length,
      description: `${totalSignatureEntries} total check-ins`,
      icon: Building2,
    },
    {
      title: "Sessions attended",
      value: attendedSessions.length,
      description: "Sessions with your user registered",
      icon: CalendarDays,
    },
    {
      title: "Connections",
      value: totalConnections,
      description: "People you have connected with",
      icon: Handshake,
    },
    {
      title: "Achievements",
      value: earnedAchievements.length,
      description: `${earnedAchievements.reduce((acc, achievement) => acc + achievement.value, 0)} points earned`,
      icon: Trophy,
    },
  ];

  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-start gap-y-2 p-4 text-start text-sm">
        <h1 className="text-2xl font-bold">User Statistics</h1>
        <span className="text-gray-600">
          A quick view of your activity at SINFO.
        </span>
      </div>

      <GridList title="Overview" className="!justify-start">
        {statisticCards.map(({ title, value, description, icon: Icon }) => (
          <div
            key={title}
            className="min-w-[220px] flex-1 rounded-md bg-white shadow-md p-4 flex items-start gap-3"
          >
            <div className="rounded-full bg-sinfo-primary/10 text-sinfo-primary p-2">
              <Icon size={18} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm text-gray-600">{title}</span>
              <span className="text-3xl font-bold leading-none">{value}</span>
              <span className="text-xs text-gray-500">{description}</span>
            </div>
          </div>
        ))}
      </GridList>

      {visitedCompanies?.length ? (
        <GridList
          title="Visited companies"
          description="Companies you have checked in to"
        >
          {visitedCompanies.map((company) => (
            <ListCard
              key={company.id}
              title={company.name}
              subtitle="Visited company"
              img={company.img}
              link={`/companies/${company.id}`}
            />
          ))}
        </GridList>
      ) : (
        <List
          title="Visited companies"
          description="Companies you have checked in to"
        >
          <ListCard
            title="No company visits yet"
            subtitle="Visit a company and scan your QR code to start collecting stats"
            link="/venue"
          />
        </List>
      )}

      {attendedSessions.length ? (
        <List
          title="Attended sessions"
          description="Sessions where you were checked in"
        >
          {attendedSessions
            .sort((a, b) => a.date.localeCompare(b.date))
            .map((sessionItem) => (
              <SessionTile key={sessionItem.id} session={sessionItem} />
            ))}
        </List>
      ) : (
        <List
          title="Attended sessions"
          description="Sessions where you were checked in"
        >
          <ListCard
            title="No sessions attended yet"
            subtitle="Attend a session to see it here"
            link="/schedule"
          />
        </List>
      )}
    </div>
  );
}
