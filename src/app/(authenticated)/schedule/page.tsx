import { SessionService } from "@/services/SessionService";
import ScheduleTable from "./ScheduleTable";

export default async function Schedule() {
  const sessions = await SessionService.getSessions();

  if (!sessions) {
    return <div>Sessions not found!</div>;
  }

  return (
    <div className="container mx-auto">
      <ScheduleTable sessions={sessions} />
    </div>
  );
}
