"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import EventDayButton from "@/components/EventDayButton";
import GridList from "@/components/GridList";
import ZoomSvg from "@/components/svg/ZoomableSvg";
import CompanyStand from "./stands/CompanyStand";
import Entrances from "./stands/Entrances";
import CoworkingZone from "./stands/CoworkingZone";
import SessionsStands from "./stands/SessionsZone";
import FoodZone from "./stands/FoodZone";

interface VenueStandsProps {
  companies: Company[];
}

const VenueStands: React.FC<VenueStandsProps> = ({ companies }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // Extract the 'day' parameter from the URL search parameters
  const dayParam = searchParams.get("day");
  const [showingDay, setShowingDay] = useState<string | null>(null);

  const standPositions: Record<number, { x: number; y: number }> = {
    1: { x: 118, y: 188 },
    2: { x: 118, y: 218 },
    3: { x: 180, y: 142 },
    4: { x: 209, y: 142 },
    5: { x: 180, y: 171 },
    6: { x: 209, y: 171 },
    7: { x: 180, y: 218 },
    8: { x: 209, y: 218 },
    9: { x: 276, y: 142 },
    10: { x: 305, y: 142 },
    11: { x: 276, y: 189 },
    12: { x: 305, y: 189 },
    13: { x: 276, y: 219 },
    14: { x: 305, y: 219 },
    15: { x: 367, y: 142 },
    16: { x: 396, y: 142 },
    17: { x: 367, y: 171 },
    18: { x: 396, y: 171 },
    19: { x: 367, y: 218 },
    20: { x: 396, y: 218 },
    21: { x: 453, y: 137 },
    22: { x: 453, y: 165 },
    23: { x: 453, y: 193 },
    24: { x: 453, y: 222 },
  };

  const getAllUniqueDates = (companies: Company[]): string[] => {
    return Array.from(
      new Set(
        companies
          .flatMap((company) => company.stands || [])
          .map((stand) => stand.date)
      )
    ).sort();
  };

  const sortedDays = getAllUniqueDates(companies);
  console.log(sortedDays);

  const companiesForSelectedDay = useMemo(() => {
    if (!showingDay) return [];
    return companies.filter((company) =>
      company.stands?.some((stand) => stand.date === showingDay)
    );
  }, [companies, showingDay]);

  const getCompanyAtPosition = (standId: string): Company | null => {
    if (!showingDay) return null;

    return (
      companiesForSelectedDay.find((company) =>
        company.stands?.some(
          (stand) => stand.date === showingDay && stand.standId === standId
        )
      ) || null
    );
  };

  const standsForSelectedDay = useMemo(() => {
    if (!showingDay) return [];
    return companies.flatMap(
      (company) =>
        company.stands?.filter((stand) => stand.date === showingDay) || []
    );
  }, [companies, showingDay]);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const defaultDay = sortedDays.includes(today) ? today : sortedDays[0];

    if (!showingDay) {
      setShowingDay(dayParam || defaultDay);
    }
  }, [dayParam, sortedDays, showingDay]);

  const updateSearchParam = (newDay: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("day", newDay);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    if (dayParam && sortedDays.includes(dayParam)) {
      setShowingDay(dayParam);
    }
  }, [dayParam, sortedDays]);

  return (
    <div className="w-full space-y-8">
      <GridList>
        {sortedDays.map((day) => (
          <EventDayButton
            key={`event-day-${day}`}
            date={day}
            onClick={() => {
              setShowingDay(day);
              updateSearchParam(day);
            }}
            selected={showingDay === day}
          />
        ))}
      </GridList>

      <ZoomSvg minZoom={0.6}>
        <svg viewBox="0 0 512 380" className="w-full h-auto max-w-4xl mx-auto">
          <Entrances />
          <SessionsStands />
          <FoodZone />
          <CoworkingZone />

          {/* Company Stands */}
          <g id="stands">
            {standsForSelectedDay.map((stand) => (
              <CompanyStand
                key={`stand-${stand.standId}`}
                stand={stand}
                company={getCompanyAtPosition(stand.standId)}
                standPositions={standPositions}
              />
            ))}
          </g>
        </svg>
      </ZoomSvg>
    </div>
  );
};

export default VenueStands;
