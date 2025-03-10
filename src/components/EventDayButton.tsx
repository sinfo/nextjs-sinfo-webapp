import {
  getEventDay,
  getEventFullDate,
  getEventMonth,
  getEventWeekday,
} from "@/utils/utils";

interface EventDayButtonProps {
  date: string;
  onClick?: () => void;
  selected?: boolean;
  disabled?: boolean;
}

export default function EventDayButton({
  date,
  onClick,
  selected = false,
  disabled = false,
}: EventDayButtonProps) {
  return (
    <button
      className="flex flex-col items-center text-center gap-y-1 py-1"
      title={getEventFullDate(date)}
      onClick={onClick}
      disabled={disabled}
    >
      <span
        className={`flex items-center justify-center font-mono rounded-full w-10 h-10 shadow-md focus:shadow-none outline outline-sinfo-primary ${!selected ? "text-sinfo-primary hover:bg-slate-50" : "text-white bg-sinfo-primary"}`}
      >
        {getEventDay(date)}
      </span>
      <div className="flex flex-col items-center justify-center">
        <span className="text-xs">{getEventMonth(date)}</span>
        <span className="text-xs text-gray-600">
          ({getEventWeekday(date, true)})
        </span>
      </div>
    </button>
  );
}
