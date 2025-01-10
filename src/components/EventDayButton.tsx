import { getEventDay, getEventFullDate, getEventMonth } from "@/utils/utils";

interface EventDayButtonProps {
  date: string;
  onClick?: () => void;
  selected?: boolean;
}

export default function EventDayButton({
  date,
  onClick,
  selected = false,
}: EventDayButtonProps) {
  return (
    <button
      className="flex flex-col items-center text-center gap-y-1 py-2"
      title={getEventFullDate(date)}
      onClick={onClick}
      disabled={!onClick}
    >
      <span
        className={`flex items-center justify-center font-mono rounded-full w-10 h-10 shadow-md focus:shadow-none ${selected ? "text-blue-dark outline outline-blue-dark" : "text-white bg-blue-dark"}`}
      >
        {getEventDay(date)}
      </span>
      <span className="text-xs text-gray-500">
        {getEventMonth(date, false)}
      </span>
    </button>
  );
}
