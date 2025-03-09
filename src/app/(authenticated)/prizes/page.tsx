import authOptions from "@/app/api/auth/[...nextauth]/authOptions";
import List from "@/components/List";
import { PrizeTile } from "@/components/prize";
import { AchievementService } from "@/services/AchievementService";
import { PrizeService } from "@/services/PrizeService";
import { SessionService } from "@/services/SessionService";
import { UserService } from "@/services/UserService";
import { isCompany, isMember } from "@/utils/utils";
import { getServerSession } from "next-auth";
import PrizeSessions from "./PrizeSessions";
import MessageCard from "@/components/MessageCard";
import DailyPrizesTable from "./DailyPrizesTable";
import BlankPageWithMessage from "@/components/BlankPageMessage";

export default async function Prizes() {
  const prizes = await PrizeService.getPrizes();

  if (!prizes) {
    return <BlankPageWithMessage message="Prizes not found!" />;
  }

  const session = await getServerSession(authOptions);
  const user = await UserService.getMe(session!.cannonToken);

  // Kinds of prizes
  const cvPrize = prizes.find((p) => p.cv);
  const dailyPrizes = prizes.filter((p) => p.days?.length);
  const sessionPrizes = prizes.filter((p) => p.sessions?.length);

  const sinfoSessions = (await SessionService.getSessions()) || [];
  // TODO: Sort sessions and put at first the next ones

  async function getCVPrizeParticipants() {
    const achievements = await AchievementService.getAchievements();
    const cvPrizeUsers = achievements?.find((a) => a.kind === "cv")?.users;

    return (
      cvPrizeUsers?.map((u) => ({
        userId: u,
        entries: achievements?.reduce(
          (acc, a) => (a.users?.includes(u) ? acc + a.value : acc),
          0,
        ),
      })) || []
    );
  }

  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-start gap-y-2 p-4 text-start text-sm">
        <h1 className="text-2xl font-bold">Prizes</h1>
        {user && isCompany(user.role) && (
          <MessageCard
            type="info"
            content="As a company you are not allowed to participate in this prize."
          />
        )}
      </div>

      {/* CV */}
      {cvPrize && (
        <List
          title="CV Prize"
          description="Submit your CV and get the chance to win"
        >
          <PrizeTile
            prize={cvPrize}
            participants={await getCVPrizeParticipants()}
            pickWinner={!!user && isMember(user.role)}
            cannonToken={session?.cannonToken}
          />
        </List>
      )}

      {/* Daily Prizes */}
      <div className="flex flex-col">
        <div className="flex flex-col px-4">
          <h3 className="text-lg font-bold">Daily prizes</h3>
          <span className="text-sm text-gray-600">
            Visit SINFO and get the chance to win
          </span>
        </div>
        <DailyPrizesTable
          prizes={dailyPrizes}
          cannonToken={session!.cannonToken}
          user={user || undefined}
        />
      </div>

      {/* Sessions Prizes */}
      <List
        title="Session prizes"
        description="Go to a session and get the chance to win"
      >
        {sessionPrizes.map((sessionPrize) => (
          <div key={sessionPrize.id} className="py-4">
            <PrizeTile prize={sessionPrize} />
            <PrizeSessions
              sessions={sinfoSessions.filter((s) =>
                sessionPrize.sessions?.includes(s.id),
              )}
            />
          </div>
        ))}
      </List>
    </div>
  );
}
