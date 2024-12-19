import { trimText } from "@/utils/utils";
import Image from "next/image";

interface SesionTileProps {
  img: string;
  title: string;
  time: string;
  presenter: Speaker | Company | null;
  type: string;
}

export function SessionTile({
  img,
  title,
  time,
  presenter,
  type,
}: SesionTileProps) {
  return (
    <div className="w-full bg-white rounded-md shadow-md flex flex-row justify-start gap-2 items-center text-xs overflow-hidden px-4 py-2">
      <Image
        className="rounded-full"
        width={40}
        height={40}
        src={img}
        alt={`${presenter?.name && "Presenter"} image`}
      />
      <div className="w-full flex flex-col gap-0.5">
        <div className="flex flex-row items-center justify-between">
          <div>{time}</div>
          <div className="bg-blue-dark text-white rounded-md px-2 py-0.5">
            {type}
          </div>
        </div>
        <div title={title} className="text-sm">
          {trimText(title, 35)}
        </div>
        <div>{presenter ? presenter.name : "Unknown"}</div>
      </div>
    </div>
  );
}
