import { SessionService } from "@/services/SessionService";
import ScheduleTable from "./ScheduleTable";

export default async function Schedule() {
  const sessions = await SessionService.getSessions();

  if (!sessions) {
    return <div>Sessions not found!</div>;
  }

  return (
    <div className="container m-auto h-full text-black">
      <div className="flex flex-col items-start gap-y-2 p-4 text-start text-sm">
        <h1 className="text-2xl font-bold">Schedule</h1>
        <p className="text-sm text-gray-500">
          Checkout all the available sessions.
        </p>
      </div>
      <ScheduleTable sessions={sessions} defaultToday />
    </div>
  );
}
