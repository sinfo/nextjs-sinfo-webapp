import authOptions from "@/app/api/auth/[...nextauth]/authOptions";
import GridList from "@/components/GridList";
import List from "@/components/List";
import ListCard from "@/components/ListCard";
import MessageCard from "@/components/MessageCard";
import AchievementTile from "@/components/user/AchievementTile";
import CurriculumVitae from "@/components/user/CurriculumVitae";
import ProfileHeader from "@/components/user/ProfileHeader";
import { UserTile } from "@/components/user/UserTile";
import { UserService } from "@/services/UserService";
import { isCompany } from "@/utils/utils";
import { Award, UserPen } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { Suspense } from "react";

const N_ACHIEVEMENTS = 5;
const N_CONNECTIONS = 3;

export default async function Profile() {
  const session = (await getServerSession(authOptions))!;
  const user: User | null = await UserService.getMe(session.cannonToken);

  if (!user) {
    return <div> Profile not found</div>;
  }

  return (
    <div className="container m-auto h-full text-black">
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
          <Suspense fallback={<div>Loading</div>}>
            <CurriculumVitae session={session} user={user} currentUser />
          </Suspense>
        </List>
      )}

      {/* Academic information */}
      {!isCompany(user.role) && (
        <List title="Academic Information">
          <MessageCard
            type="info"
            content="This information only shows to companies that scanned your QR code"
          />
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
      )}

      {/* Achievements */}
      <GridList
        title="Achievements"
        description={`Total points: ${user.achievements?.reduce((acc, a) => acc + a.value, 0) || 0}`}
        link="/profile/achievements"
        linkText="See all"
      >
        {user.achievements?.length ? (
          user.achievements
            ?.slice(0, N_ACHIEVEMENTS)
            .map((a) => <AchievementTile key={a.id} achievement={a} achieved />)
        ) : (
          <ListCard
            title="Start winning achievements"
            subtitle="Click here to know more"
            link="/profile/achievements"
            icon={Award}
          />
        )}
      </GridList>

      {/* Connections */}
      {user.connections?.length ? (
        <List
          title="Connections"
          link="/profile/connections"
          linkText="See all"
        >
          {user.connections.slice(0, N_CONNECTIONS).map((u) => (
            <UserTile key={u.id} user={u} />
          ))}
        </List>
      ) : (
        <></>
      )}
    </div>
  );
}
