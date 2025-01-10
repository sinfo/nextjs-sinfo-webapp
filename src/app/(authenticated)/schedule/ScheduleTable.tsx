"use client";

import EventDayButton from "@/components/EventDayButton";
import GridList from "@/components/GridList";
import List from "@/components/List";
import { SessionTile } from "@/components/session";
import { getEventFullDate } from "@/utils/utils";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

interface ScheduleTableProps {
  sessions: SINFOSession[];
}

export default function ScheduleTable({ sessions }: ScheduleTableProps) {
  const searchParams = useSearchParams();
  const [showingDay, setShowingDay] = useState<string | null>(null);

  const sessionsByDay = useMemo(() => {
    const sortedSessions = sessions.sort((a, b) =>
      a.date.localeCompare(b.date),
    );
    return sortedSessions.reduce(
      (acc, s) => {
        const day = s.date.split("T")[0];
        const daySessions = [...(acc[day] || []), s];
        return { ...acc, [day]: daySessions };
      },
      {} as Record<string, SINFOSession[]>,
    );
  }, [sessions]);

  const sortedDays = useMemo(
    () => Object.keys(sessionsByDay).sort(),
    [sessionsByDay],
  );

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const searchParamDay = searchParams.get("day");
    const day = searchParamDay === "today" ? today : searchParamDay;
    setShowingDay(sortedDays.find((d) => day === d) || null);
  }, [sortedDays]);

  return (
    <>
      <GridList>
        {sortedDays.map((d) => (
          <EventDayButton
            key={`event-day-${d}`}
            date={d}
            onClick={() =>
              setShowingDay((currentDay) => (currentDay === d ? null : d))
            }
            selected={showingDay === d}
          />
        ))}
      </GridList>
      {sortedDays
        .filter((d) => !showingDay || d === showingDay)
        .map((d) => (
          <List key={d} title={getEventFullDate(d)}>
            {sessionsByDay[d].map((s) => (
              <SessionTile key={s.id} session={s} />
            ))}
          </List>
        ))}
    </>
  );
}
