import List from "@/components/List";
import { SessionTile } from "@/components/session";
import { SessionService } from "@/services/SessionService";
import { getEventFullDate } from "@/utils/utils";

export default async function Schedule() {
  const sessions = await SessionService.getSessions();

  if (!sessions) {
    return <div>Sessions not found!</div>;
  }

  const sortedSessions = sessions.sort((a, b) => a.date.localeCompare(b.date));
  const sessionsByDay = sortedSessions.reduce(
    (acc, s) => {
      const day = s.date.split("T")[0];
      const daySessions = [...(acc[day] || []), s];
      return { ...acc, [day]: daySessions };
    },
    {} as Record<string, SINFOSession[]>,
  );
  const sortedDays = Object.keys(sessionsByDay).sort();

  return (
    <div className="container m-auto h-full text-black">
      {sortedDays.map((d) => (
        <List title={getEventFullDate(d)}>
          {sessionsByDay[d].map((s) => (
            <SessionTile key={s.id} session={s} />
          ))}
        </List>
      ))}
    </div>
  );
}
