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
import { getServerSession } from "next-auth";
import UserSignOut from "@/components/UserSignOut";
import BlankPageWithMessage from "@/components/BlankPageMessage";
import ProfileButtons from "./buttons";
import Notes from "@/components/user/Notes";
import { EventService } from "@/services/EventService";

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

  const event = await EventService.getLatest();

  const achievements = await AchievementService.getAchievements();
  const userAchievements = achievements?.filter((a) =>
    a.users?.includes(userProfile.id),
  );

  const { connections } = (await UserService.getConnections(
    session.cannonToken,
  )) || { connections: [] };
  const connection = connections?.find((c) => c.to === userProfile.id);

  async function handleNotesUpdate(notes: string) {
    "use server";
    if (userProfile)
      await UserService.updateConnection(
        session.cannonToken,
        userProfile.id,
        notes,
      );
  }

  return (
    <div className="container mx-auto">
      <ProfileHeader user={userProfile} />

      <ProfileButtons
        cannonToken={session.cannonToken}
        user={user}
        otherUser={userProfile}
        connections={connections ?? []}
        edition={event?.id ?? ``}
      />

      {/* Notes */}
      {connection && (
        <Notes notes={connection.notes} onNotesUpdate={handleNotesUpdate} />
      )}

      {!isCompany(userProfile.role) &&
        (isCompany(user.role) || isMember(user.role)) && (
          <List title="Curriculum Vitae (CV)">
            <CurriculumVitae
              user={userProfile}
              session={session}
              currentUser={userProfile.id === user.id}
            />
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
