import authOptions from "@/app/api/auth/[...nextauth]/authOptions";
import GridList from "@/components/GridList";
import List from "@/components/List";
import ListCard from "@/components/ListCard";
import AchievementTile from "@/components/user/AchievementTile";
import ProfileHeader from "@/components/user/ProfileHeader";
import { UserTile } from "@/components/user/UserTile";
import { UserService } from "@/services/UserService";
import { getServerSession } from "next-auth";

const N_ACHIEVEMENTS = 5;
const N_CONNECTIONS = 3;

export default async function Profile() {
  const session = await getServerSession(authOptions);
  const user: User | null = await UserService.getMe(session!.cannonToken);

  if (!user) {
    return <div> Profile not found</div>;
  }

  return (
    <div className="container m-auto h-full text-black">
      <ProfileHeader user={user} />
      {/* <button className="button-primary text-sm font-bold uppercase w-full mt-2">
        <UserPen size={16} />
        Edit profile
      </button>
      */}

      {/* Academic information */}
      <List title="Academic Information">
        <ListCard
          title="Computer Science and Engineering"
          subtitle="Instituto Superior Técnico"
          headtext="Master degree"
          label="In progress"
        />
        <ListCard
          title="Computer Science and Engineering"
          subtitle="Instituto Superior Técnico"
          headtext="Bachelors degree"
          label="Finished"
        />
      </List>

      {/* Achievements */}
      <GridList
        title="Achievements"
        description={`Total points: ${user.achievements?.reduce((acc, a) => acc + a.value, 0) || 0}`}
        link="/profile/achievements"
        linkText="See all"
      >
        {user.achievements
          ?.slice(0, N_ACHIEVEMENTS)
          .map((a) => <AchievementTile key={a.id} achievement={a} achieved />)}
      </GridList>

      {/* Connections */}
      {user.connections?.length && (
        <List
          title="Connections"
          link="/profile/connections"
          linkText="See all"
        >
          {user.connections.slice(0, N_CONNECTIONS).map((u) => (
            <UserTile key={u.id} user={u} />
          ))}
        </List>
      )}
    </div>
  );
}
