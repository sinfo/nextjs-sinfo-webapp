"use client";

import { appleCalendarIcon, googleCalendarIcon } from "@/assets/icons";
import moment from "moment";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export interface CalendarButtonProps {
  name: string;
  type: "google" | "apple";
  startDate: string;
  duration: number; // in minutes
  location: string;
  description?: string;
}

function formatTime(date: string): string {
  return moment.utc(date).format("YYYYMMDDTHHmmssZ").replace("+00:00", "Z");
}

function formatDate(date: string, duration: number): string {
  const startDate = formatTime(date);
  const endDate = formatTime(
    moment.utc(date).add(duration, "minutes").toISOString(),
  );
  return `${startDate}%2F${endDate}`;
}

export function CalendarButton({
  name,
  type,
  startDate,
  duration,
  location,
  description,
}: CalendarButtonProps) {
  const [URL, setURL] = useState<string | null>();

  useEffect(() => {
    let ICSFile = "BEGIN:VCALENDAR";
    ICSFile += "\nVERSION:2.0";
    ICSFile += "\nBEGIN:VEVENT";
    ICSFile += `\nURL:${window.location}`;
    ICSFile += `\nDESCRIPTION:${description}`;
    ICSFile += `\nDTSTART:${formatTime(startDate)}`;
    ICSFile += `\nDTEND:${formatTime(moment.utc(startDate).add(duration, "minutes").toISOString())}`;
    ICSFile += `\nSUMMARY:${name}`;
    ICSFile += `\nLOCATION:${location}`;
    ICSFile += "\nEND:VEVENT";
    ICSFile += "\nEND:VCALENDAR";

    setURL(
      {
        google: `https://calendar.google.com/calendar/render?action=TEMPLATE&dates=${formatDate(startDate, duration)}&details=${encodeURIComponent(description ?? "")}&location=${encodeURIComponent(location)}&text=${encodeURIComponent(name)}`,
        apple: "data:text/calendar;charset=utf8," + encodeURIComponent(ICSFile),
      }[type],
    );
  }, [name, type, startDate, duration, location, description]);

  if (!URL) return <></>;

  return (
    <Link
      href={URL}
      className="button button-primary !bg-white !text-sinfo-primary text-sm flex-1"
      target="_blank"
      download={type === "apple" ? "event.ics" : undefined}
    >
      {type === "google" && (
        <span className="flex justify-start items-center gap-x-2">
          <Image
            width={24}
            height={24}
            src={googleCalendarIcon}
            alt="Google Calendar Icon"
          />
          Google Calendar
        </span>
      )}
      {type === "apple" && (
        <span className="flex justify-start items-center gap-x-2">
          <Image
            width={24}
            height={24}
            src={appleCalendarIcon}
            alt="Apple Calendar Icon"
          />
          ICS File (Apple)
        </span>
      )}
    </Link>
  );
}
