import { trimText } from "@/utils/utils";
import Image from "next/image";

interface SpeakerTileProps {
  name: string;
  img: string;
  companyImg?: string;
}

export function SpeakerTile({ name, img, companyImg }: SpeakerTileProps) {
  return (
    <div className="w-40 h-48 bg-white shadow-md flex flex-col justify-between text-sm text-center overflow-hidden p-2">
      <div title={name} className="h-[20%] whitespace-nowrap">
        {trimText(name, 12)}
      </div>
      <div className="h-[60%]">
        <Image
          className="w-full h-full object-contain"
          width={100}
          height={100}
          src={img}
          alt={`${name} image`}
        />
      </div>
      <div className="h-[20%]">
        {companyImg && (
          <Image
            className="w-[50%] h-full mx-auto object-contain"
            width={100}
            height={100}
            src={companyImg}
            alt={`${name} company image`}
          />
        )}
      </div>
    </div>
  );
}
