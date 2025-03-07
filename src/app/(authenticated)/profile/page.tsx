import authOptions from "@/app/api/auth/[...nextauth]/authOptions";
import GridList from "@/components/GridList";
import List from "@/components/List";
import ListCard from "@/components/ListCard";
import AchievementTile from "@/components/user/AchievementTile";
import ConnectionTile from "@/components/user/ConnectionTile";
import CurriculumVitae from "@/components/user/CurriculumVitae";
import ProfileHeader from "@/components/user/ProfileHeader";
import ProfileInformations from "@/components/user/ProfileInformations";
import UserSignOut from "@/components/UserSignOut";
import { AchievementService } from "@/services/AchievementService";
import { UserService } from "@/services/UserService";
import { isCompany } from "@/utils/utils";
import { Award, UserPen } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";

const N_ACHIEVEMENTS = 5;
const N_CONNECTIONS = 3;

export default async function Profile() {
  const session = (await getServerSession(authOptions))!;
  const user = await UserService.getMe(session.cannonToken);
  if (!user) return <UserSignOut />;

  const achievements = await AchievementService.getAchievements();
  const userAchievements = achievements?.filter((a) =>
    a.users?.includes(user.id),
  );

  const { connections, suggestions } = (await UserService.getConnections(
    session.cannonToken,
  )) || { connections: [], suggestions: [] };

  return (
    <div className="container mx-auto">
      <ProfileHeader user={user} />
      <div className="px-4 py-2">
        <Link
          className="button-primary text-sm w-full mt-2"
          href="/profile/edit"
        >
          <UserPen size={16} />
          Edit profile
        </Link>
      </div>

      {/* CV */}
      {!isCompany(user.role) && (
        <List
          title="Curriculum Vitae (CV)"
          description="Submit your CV and get the chance to win a prize"
        >
          <CurriculumVitae session={session} user={user} currentUser />
        </List>
      )}

      {/* User informations */}
      <ProfileInformations user={user} />

      {/* Achievements */}
      <GridList
        title="Achievements"
        description={`Total points: ${userAchievements?.reduce((acc, a) => acc + a.value, 0) || 0}`}
        link="/profile/achievements"
        linkText="See all"
      >
        {userAchievements?.length ? (
          userAchievements
            ?.slice(0, N_ACHIEVEMENTS)
            .map((a) => <AchievementTile key={a.id} achievement={a} achieved />)
        ) : (
          <ListCard
            title="Start winning achievements"
            subtitle="Click to know more"
            link="/profile/achievements"
            icon={Award}
          />
        )}
      </GridList>

      {/* Connections */}
      {!!connections?.length && (
        <List
          title="Connections"
          link="/profile/connections"
          linkText="See all"
        >
          {connections.slice(0, N_CONNECTIONS).map((c) => (
            <ConnectionTile key={c.to} connection={c} />
          ))}
        </List>
      )}
    </div>
  );
}
