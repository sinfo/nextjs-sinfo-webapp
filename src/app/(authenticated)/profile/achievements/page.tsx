import authOptions from "@/app/api/auth/[...nextauth]/authOptions";
import GridList from "@/components/GridList";
import AchievementTile from "@/components/user/AchievementTile";
import { AchievementService } from "@/services/AchievementService";
import { UserService } from "@/services/UserService";
import { formatAchievementKind } from "@/utils/utils";
import { getServerSession } from "next-auth";

export default async function Achievements() {
  const session = await getServerSession(authOptions);
  const user: User | null = await UserService.getMe(session!.cannonToken);

  let achievements = await AchievementService.getAchievements();
  if (!achievements || achievements.length == 0) {
    return (
      <div className="text-gray-600 text-center mt-5">
        Achievements not available yet.
      </div>
    );
  }

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

  const userAchievementIds = new Set(
    user?.editionAchievements?.map((a) => a.id) || []
  );

  return (
    <div className="container m-auto h-full">
      <div className="flex flex-col items-start gap-y-2 p-4 text-start text-sm">
        <h1 className="text-2xl font-bold">Achievements</h1>
        <span className="text-gray-600">
          Total points:{" "}
          {user?.editionAchievements?.reduce((acc, a) => acc + a.value, 0) || 0}
        </span>
        {/* TODO: Add bullshit text, ask ChatGPT or Copilot */}
      </div>
      {sortedKinds.map((k) => (
        <GridList key={k} title={formatAchievementKind(k)}>
          {achievementsByKind[k].map((a) => (
            <AchievementTile
              key={a.id}
              achievement={a}
              achieved={userAchievementIds.has(a.id)}
            />
          ))}
        </GridList>
      ))}
    </div>
  );
}
