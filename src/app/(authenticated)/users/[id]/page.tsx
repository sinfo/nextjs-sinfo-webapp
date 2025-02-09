import authOptions from "@/app/api/auth/[...nextauth]/authOptions";
import GridList from "@/components/GridList";
import List from "@/components/List";
import AchievementTile from "@/components/user/AchievementTile";
import CurriculumVitae from "@/components/user/CurriculumVitae";
import ProfileHeader from "@/components/user/ProfileHeader";
import ProfileInformations from "@/components/user/ProfileInformations";
import { AchievementService } from "@/services/AchievementService";
import { UserService } from "@/services/UserService";
import { isCompany, isMember } from "@/utils/utils";
import { UserPlus } from "lucide-react";
import { getServerSession } from "next-auth";
import DemoteButton from "./DemoteButton";
import UserSignOut from "@/components/UserSignOut";
import BlankPageWithMessage from "@/components/BlankPageMessage";

interface UserProfileParams {
  id: string;
}

export default async function UserProfile({
  params,
}: {
  params: UserProfileParams;
}) {
  const { id: userID } = params;

  const session = (await getServerSession(authOptions))!;
  const user = await UserService.getMe(session.cannonToken);
  if (!user) return <UserSignOut />;

  const userProfile = await UserService.getUser(session.cannonToken, userID);
  if (!userProfile) {
    return <BlankPageWithMessage message="User not found!" />;
  }

  const isMyself = userProfile.id === user.id;

  const achievements = await AchievementService.getAchievements();
  const userAchievements = achievements?.filter((a) =>
    a.users?.includes(userProfile.id)
  );

  return (
    <div className="container mx-auto">
      <ProfileHeader user={userProfile} />
      {!isMyself && (
        <div className="px-4 py-2">
          <button className="button-primary text-sm w-full mt-2">
            <UserPlus size={16} />
            Connect
          </button>
          {isMember(user.role) &&
            (isMember(userProfile.role) || isCompany(userProfile.role)) && (
              <DemoteButton
                cannonToken={session.cannonToken}
                userId={userProfile.id}
              />
            )}
        </div>
      )}

      {/* Notes */}
      {/* <List title="Notes">
        {userNotes && userNotes.trim() !== "" ? (
          <ShowMore lines={3}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </ShowMore>
        ) : (
          <ListCard title="Write a note" icon={NotebookPen} />
        )}
      </List> */}

      {!isCompany(userProfile.role) &&
        (isCompany(user.role) || isMember(user.role)) && (
          <List title="Curriculum Vitae (CV)">
            <CurriculumVitae user={userProfile} session={session} />
          </List>
        )}

      {/* User information */}
      <ProfileInformations user={userProfile} />

      {/* Achievements */}
      {userAchievements?.length ? (
        <GridList
          title="Achievements"
          description={`Total points: ${userAchievements?.reduce((acc, a) => acc + a.value, 0) || 0}`}
          scrollable
        >
          {userAchievements.map((a) => (
            <AchievementTile key={a.id} achievement={a} achieved />
          ))}
        </GridList>
      ) : (
        <></>
      )}
    </div>
  );
}
