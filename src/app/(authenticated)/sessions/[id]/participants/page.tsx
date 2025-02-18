import authOptions from "@/app/api/auth/[...nextauth]/authOptions";
import BlankPageWithMessage from "@/components/BlankPageMessage";
import List from "@/components/List";
import { UserTile } from "@/components/user/UserTile";
import { AchievementService } from "@/services/AchievementService";
import { SessionService } from "@/services/SessionService";
import { UserService } from "@/services/UserService";
import { getServerSession } from "next-auth";
import RemoveUser from "./RemoveUser";

interface SessionParticipantsParams {
  id: string;
}

export default async function SessionParticipants({
  params,
}: {
  params: SessionParticipantsParams;
}) {
  const { id: sessionID } = params;

  const sinfoSession = await SessionService.getSession(sessionID);

  if (!sinfoSession) {
    return <BlankPageWithMessage message="Session not found!" />;
  }

  const session = (await getServerSession(authOptions))!;

  const sessionAchievement = await AchievementService.getAchievementBySession(
    session.cannonToken,
    sessionID,
  );
  if (!sessionAchievement) {
    return <BlankPageWithMessage message="Sesssion Achievement not found!" />;
  }

  async function removeUser(userId: string) {
    "use server";
    await AchievementService.removeUser(
      session.cannonToken,
      sessionAchievement!.id,
      userId,
    );
  }

  async function getUserTile(userId: string) {
    const user = await UserService.getUser(session!.cannonToken, userId);
    if (!user) return undefined;
    return (
      <div className="flex items-center gap-x-2 w-full">
        <UserTile key={user.id} user={user} />
        <RemoveUser
          userId={user.id}
          userName={user.name}
          handleRemoveUser={removeUser}
        />
      </div>
    );
  }

  const unregisteredUsers = sessionAchievement.unregisteredUsers || 0;
  const totalUsers =
    (sessionAchievement.users?.length ?? 0) + unregisteredUsers;

  return (
    <div className="container mx-auto">
      <List
        title="Participants"
        description={`Total ${totalUsers} participants (${unregisteredUsers} unregistered users)`}
      >
        {sessionAchievement.users?.length ? (
          await Promise.all(
            sessionAchievement.users.map((id) => getUserTile(id)),
          )
        ) : (
          <div>There are no registered users at this session</div>
        )}
      </List>
    </div>
  );
}
