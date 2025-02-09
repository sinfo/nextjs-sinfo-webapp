import { SessionService } from "@/services/SessionService";
import SessionCheckInScanner from "./SessionCheckInScanner";
import { getServerSession } from "next-auth";
import authOptions from "@/app/api/auth/[...nextauth]/authOptions";
import BlankPageWithMessage from "@/components/BlankPageMessage";

interface SessionCheckInParams {
  id: string;
}

export default async function SessionCheckIn({
  params,
}: {
  params: SessionCheckInParams;
}) {
  const { id: sessionID } = params;

  const sinfoSession = await SessionService.getSession(sessionID);

  if (!sinfoSession) {
    return <BlankPageWithMessage message="Session not found!" />;
  }

  const session = await getServerSession(authOptions);

  return (
    <div className="container mx-auto flex-1">
      <SessionCheckInScanner
        sinfoSession={sinfoSession}
        cannonToken={session!.cannonToken}
      />
    </div>
  );
}
