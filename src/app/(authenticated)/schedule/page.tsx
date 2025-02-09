import { SessionService } from "@/services/SessionService";
import ScheduleTable from "./ScheduleTable";
import BlankPageWithMessage from "@/components/BlankPageMessage";

export default async function Schedule() {
  const sessions = await SessionService.getSessions();

  if (!sessions) {
    return <BlankPageWithMessage message="No sessions found!" />;
  }

  return (
    <div className="container mx-auto">
      <ScheduleTable sessions={sessions} />
    </div>
  );
}
