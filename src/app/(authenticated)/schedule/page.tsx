import { SessionService } from "@/services/SessionService";
import ScheduleTable from "./ScheduleTable";

export default async function Schedule() {
  const sessions = await SessionService.getSessions();

  if (!sessions) {
    return <div>Sessions not found!</div>;
  }

  return (
    <div className="container m-auto h-full">
      <ScheduleTable sessions={sessions} />
    </div>
  );
}
