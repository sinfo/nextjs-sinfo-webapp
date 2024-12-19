import { trimText } from "@/utils/utils";
import Image from "next/image";

interface CompanyTileProps {
  name: string;
  img: string;
  imgAltText?: string;
  hereToday?: boolean;
}

export function CompanyTile({
  name,
  img,
  imgAltText = "No alt text.",
  hereToday = false,
}: CompanyTileProps) {
  return (
    <div className="w-40 h-48 bg-white shadow-md flex flex-col justify-between text-sm text-center overflow-hidden p-2">
      <div title={name} className="h-1/6 whitespace-nowrap">
        {trimText(name, 12)}
      </div>
      <div className="h-4/6">
        <Image
          className="w-full h-full object-contain"
          width={100}
          height={100}
          src={img}
          alt={imgAltText}
        />
      </div>
      <div className="h-1/6">
        {hereToday && (
          <span className="bg-blue-dark text-white rounded-md px-3 py-1">
            Here Today
          </span>
        )}
      </div>
    </div>
  );
}
