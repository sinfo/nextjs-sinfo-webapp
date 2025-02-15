"use client";

import EventDayButton from "@/components/EventDayButton";
import GridList from "@/components/GridList";
import List from "@/components/List";
import { SessionTile } from "@/components/session";
import { getEventFullDate } from "@/utils/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

function getPageHeading(kind: string | null) {
  switch (kind) {
    case "keynote":
      return "Keynotes";
    case "presentation":
      return "Presentations";
    case "workshop":
      return "Workshops";
    default:
      return "Schedule";
  }
}

interface ScheduleTableProps {
  sessions: SINFOSession[];
}

export default function ScheduleTable({ sessions }: ScheduleTableProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [showingDay, setShowingDay] = useState<string | null>(null);

  const dayParam = searchParams.get("day");
  const kindParam = searchParams.get("kind");
  const placeParam = searchParams.get("place");

  const sessionsByDay = useMemo(() => {
    const sessionsCleaned = sessions
      .filter((s) => {
        return (
          (!kindParam ||
            s.kind.toLowerCase() === kindParam.toLocaleLowerCase()) &&
          (!placeParam ||
            s.place.toLowerCase() === placeParam.toLocaleLowerCase())
        );
      })
      .sort((a, b) => a.date.localeCompare(b.date));

    return sessionsCleaned.reduce(
      (acc, s) => {
        const day = s.date.split("T")[0];
        const daySessions = [...(acc[day] || []), s];
        return { ...acc, [day]: daySessions };
      },
      {} as Record<string, SINFOSession[]>
    );
  }, [sessions, kindParam, placeParam]);

  const sortedDays = useMemo(
    () => Object.keys(sessionsByDay).sort(),
    [sessionsByDay]
  );

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const searchParamDay = searchParams.get("day");
    const day = searchParamDay === "today" ? today : searchParamDay;
    setShowingDay(sortedDays.find((d) => day === d) || null);
  }, [sortedDays, searchParams]);

  const updateSearchParam = (newDay: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newDay === dayParam) {
      params.delete("day");
    } else {
      params.set("day", newDay);
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    if (dayParam && sortedDays.includes(dayParam)) {
      setShowingDay(dayParam);
    }
  }, [dayParam, sortedDays]);

  return (
    <>
      <div className="flex flex-col items-start gap-y-2 p-4 text-start text-sm">
        <h1 className="text-2xl font-bold">{getPageHeading(kindParam)}</h1>
        <p className="text-sm text-gray-600">
          Checkout all the available sessions.
        </p>
      </div>
      <GridList>
        {sortedDays.map((d) => (
          <EventDayButton
            key={`event-day-${d}`}
            date={d}
            onClick={() => updateSearchParam(d)}
            selected={showingDay === d}
          />
        ))}
      </GridList>
      {sortedDays
        .filter((d) => !showingDay || d === showingDay)
        .map((d) => (
          <List key={d} title={getEventFullDate(d)}>
            {sessionsByDay[d].map((s) => (
              <SessionTile key={s.id} session={s} onlyShowHours={true} />
            ))}
          </List>
        ))}
    </>
  );
}
