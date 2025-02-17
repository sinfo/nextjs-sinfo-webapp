import authOptions from "@/app/api/auth/[...nextauth]/authOptions";
import BlankPageWithMessage from "@/components/BlankPageMessage";
import GridList from "@/components/GridList";
import AchievementTile from "@/components/user/AchievementTile";
import { AchievementService } from "@/services/AchievementService";
import { UserService } from "@/services/UserService";
import { formatAchievementKind } from "@/utils/utils";
import { getServerSession } from "next-auth";

export default async function Achievements() {
  const achievements = await AchievementService.getAchievements();

  if (!achievements) {
    return <BlankPageWithMessage message="No achievements found." />;
  }

  const session = await getServerSession(authOptions);
  const user: User | null = await UserService.getMe(session!.cannonToken);

  const userAchievements =
    user && achievements?.filter((a) => a.users?.includes(user.id));

  const achievementsByKind = achievements.reduce(
    (acc, a) => {
      const kindAchievements = [...(acc[a.kind] || []), a];
      return { ...acc, [a.kind]: kindAchievements };
    },
    {} as Record<AchievementKind, Achievement[]>
  );
  const sortedKinds = Object.keys(
    achievementsByKind
  ).sort() as AchievementKind[];

  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-start gap-y-2 p-4 text-start text-sm">
        <h1 className="text-2xl font-bold">Achievements</h1>
        <span className="text-gray-600">
          Total points:&nbsp;
          {userAchievements?.reduce((acc, a) => acc + a.value, 0) || 0}
        </span>
      </div>
      {sortedKinds.map((k) => (
        <GridList key={k} title={formatAchievementKind(k)}>
          {achievementsByKind[k]
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((a) => (
              <AchievementTile
                key={a.id}
                achievement={a}
                achieved={!!user && a.users?.includes(user.id)}
              />
            ))}
        </GridList>
      ))}
    </div>
  );
}
