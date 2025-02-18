"use client";

import EventDayButton from "@/components/EventDayButton";
import GridList from "@/components/GridList";
import List from "@/components/List";
import { PrizeParticipant, PrizeTile } from "@/components/prize";
import { AchievementService } from "@/services/AchievementService";
import { getEventFullDate, isMember } from "@/utils/utils";
import { useEffect, useMemo, useRef, useState } from "react";

interface DailyPrizesTable {
  user?: User;
  cannonToken: string;
  prizes: Prize[];
}

export default function DailyPrizesTable({
  user,
  cannonToken,
  prizes,
}: DailyPrizesTable) {
  const [showingDay, setShowingDay] = useState<string | null>(null);
  const [dailyParticipants, setDailyParticipants] =
    useState<PrizeParticipant[]>();

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

  useEffect(() => {
    if (showingDay) getDailyPrizeParticipants(showingDay);
  }, [showingDay]);

  async function getDailyPrizeParticipants(day: string) {
    const achievements = await AchievementService.getAchievements();
    const startDate = new Date(day);
    const endDate = new Date(`${day}T23:59:59Z`);
    const entries = achievements
      ?.filter(
        (a) =>
          startDate <= new Date(a.validity?.from ?? "") &&
          endDate >= new Date(a.validity?.to ?? ""),
      )
      .reduce(
        (acc, a) => {
          a.users?.forEach((u) => {
            acc[u] = (acc[u] ?? 0) + a.value;
          });
          return acc;
        },
        {} as Record<string, number>,
      );
    setDailyParticipants(
      entries &&
        Object.keys(entries).map((u) => ({ userId: u, entries: entries[u] })),
    );
  }

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
              <PrizeTile
                key={p.id}
                participants={dailyParticipants}
                prize={p}
                cannonToken={cannonToken}
                pickWinner={!!user && isMember(user.role)}
              />
            ))}
          </List>
        ))}
    </>
  );
}
