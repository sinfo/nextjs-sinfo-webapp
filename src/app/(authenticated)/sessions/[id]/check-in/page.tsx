import { SessionService } from "@/services/SessionService";
import SessionCheckInScanner from "./SessionCheckInScanner";
import { getServerSession } from "next-auth";
import authOptions from "@/app/api/auth/[...nextauth]/authOptions";

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
    return <div>Session not found</div>;
  }

  const session = await getServerSession(authOptions);

  return (
    <div className="container m-auto h-full text-black">
      <SessionCheckInScanner
        sinfoSession={sinfoSession}
        cannonToken={session!.cannonToken}
      />
    </div>
  );
}
