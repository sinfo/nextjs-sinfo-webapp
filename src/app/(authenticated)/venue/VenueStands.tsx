"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import EventDayButton from "@/components/EventDayButton";
import GridList from "@/components/GridList";
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
  const companyParam = searchParams.get("company");
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
          .map((stand) => stand.date.split("T")[0])
      )
    ).sort();
  };

  const sortedDays = getAllUniqueDates(companies);

  const companiesForSelectedDay = useMemo(() => {
    if (!showingDay) return [];
    return companies.filter((company) =>
      company.stands?.some((stand) => stand.date.split("T")[0] === showingDay)
    );
  }, [companies, showingDay]);

  const getCompanyAtPosition = (standId: string): Company | null => {
    if (!showingDay) return null;

    return (
      companiesForSelectedDay.find((company) =>
        company.stands?.some(
          (stand) =>
            stand.date.split("T")[0] === showingDay && stand.standId === standId
        )
      ) || null
    );
  };

  const standsForSelectedDay = useMemo(() => {
    if (!showingDay) return [];
    return companies.flatMap(
      (company) =>
        company.stands?.filter(
          (stand) => stand.date.split("T")[0] === showingDay
        ) || []
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
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    if (dayParam && sortedDays.includes(dayParam)) {
      setShowingDay(dayParam);
    }
  }, [dayParam, sortedDays]);

  const isStandHighlighted = (company: Company | null) => {
    return company?.id === companyParam;
  };

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

      <div className="relative w-full">
        <TransformWrapper
          initialScale={1}
          centerZoomedOut={true}
          centerOnInit={true}
        >
          {({ zoomIn, zoomOut, resetTransform, zoomToElement, ...rest }) => {
            setTimeout(() => {
              zoomToElement(`company-${companyParam}`, 3);
            }, 300); // Wait for the SVG to render

            return (
              <>
                <React.Fragment>
                  <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                    <button
                      onClick={() => zoomIn()}
                      className="button button-primary !bg-sinfo-primary flex-1 p-2 rounded hover:opacity-90 transition-opacity"
                    >
                      +
                    </button>
                    <button
                      onClick={() => zoomOut()}
                      className="button button-primary !bg-sinfo-primary flex-1 p-2 rounded hover:opacity-90 transition-opacity"
                    >
                      -
                    </button>
                    {/* <button
                  onClick={() => resetTransform()}
                  className="button button-primary !bg-sinfo-secondary flex-1 p-2 rounded hover:opacity-90 transition-opacity"
                >
                  Reset
                </button> */}
                  </div>
                  <div className="relative overflow-hidden border border-gray-300 rounded">
                    <TransformComponent>
                      <svg
                        viewBox="0 0 512 380"
                        className="w-full h-auto max-w-4xl mx-auto"
                      >
                        <Entrances />
                        <SessionsStands />
                        <FoodZone />
                        <CoworkingZone />

                        {/* Company Stands */}
                        <g id="stands">
                          {standsForSelectedDay.map((stand) => {
                            const company = getCompanyAtPosition(stand.standId);
                            return (
                              <CompanyStand
                                key={`stand-${stand.standId}`}
                                stand={stand}
                                company={company}
                                standPositions={standPositions}
                                isSelected={isStandHighlighted(company)}
                              />
                            );
                          })}
                        </g>
                      </svg>
                    </TransformComponent>
                  </div>
                </React.Fragment>
              </>
            );
          }}
        </TransformWrapper>
      </div>
    </div>
  );
};

export default VenueStands;
