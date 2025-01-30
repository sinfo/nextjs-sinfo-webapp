"use client";

import EventDayButton from "@/components/EventDayButton";
import GridList from "@/components/GridList";
import List from "@/components/List";
import { PrizeTile } from "@/components/prize";
import { getEventFullDate } from "@/utils/utils";
import { useEffect, useMemo, useState } from "react";

interface DailyPrizesTable {
  prizes: Prize[];
}

export default function DailyPrizesTable({ prizes }: DailyPrizesTable) {
  const [showingDay, setShowingDay] = useState<string | null>(null);

  const prizesByDay = useMemo(() => {
    const sortedPrizes = prizes.sort((a, b) => a.name.localeCompare(b.name));
    return sortedPrizes.reduce(
      (acc, sp) => {
        const days = sp.days!.map((d) => d.split("T")[0]);
        return days.reduce(
          (a, d) => ({ ...a, [d]: [...(a[d] || []), sp] }),
          acc,
        );
      },
      {} as Record<string, Prize[]>,
    );
  }, [prizes]);

  const sortedDays = useMemo(
    () => Object.keys(prizesByDay).sort(),
    [prizesByDay],
  );

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setShowingDay(sortedDays.find((d) => d === today) || sortedDays[0]);
  }, [sortedDays]);

  return (
    <>
      <GridList>
        {sortedDays.map((d) => (
          <EventDayButton
            key={`event-day-${d}`}
            date={d}
            onClick={() => setShowingDay(d)}
            selected={showingDay === d}
          />
        ))}
      </GridList>
      {sortedDays
        .filter((d) => !showingDay || d === showingDay)
        .map((d) => (
          <List key={d} description={getEventFullDate(d)}>
            {prizesByDay[d].map((p) => (
              <PrizeTile key={p.id} prize={p} />
            ))}
          </List>
        ))}
    </>
  );
}
