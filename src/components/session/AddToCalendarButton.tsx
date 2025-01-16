"use client";

import { ArrowDown, ArrowUp, Calendar } from "lucide-react";
import { useState } from "react";
import { CalendarButton, CalendarButtonProps } from "./CalendarButton";

interface AddToCalendarButton extends Omit<CalendarButtonProps, "type"> {}

export default function AddToCalendarButton({ ...props }: AddToCalendarButton) {
  const [isOpen, setOpen] = useState(false);

  return (
    <div className="relative inline-block text-left w-full">
      <div>
        <button
          className={`button button-primary text-sm w-full ${isOpen ? "!bg-transparent !text-sinfo-primary outline outline-sinfo-primary" : ""}`}
          onClick={() => setOpen((s) => !s)}
        >
          <Calendar size={16} />
          Add to calendar
          {isOpen ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
        </button>
      </div>

      <div
        className={`absolute right-0 z-10 mt-2 w-full origin-top-right rounded-md bg-gray-100 shadow-lg ${isOpen ? "" : "hidden"}`}
      >
        <div className="flex flex-col gap-y-2" role="none">
          <CalendarButton type="google" {...props} />
          <CalendarButton type="apple" {...props} />
        </div>
      </div>
    </div>
  );
}
