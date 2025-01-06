import Image from "next/image";

interface PrizeTileProps {
  prize: Prize;
}

export function PrizeTile({ prize }: PrizeTileProps) {
  return (
    <div className="flex flex-col justify-center items-center py-6 px-2 bg-white shadow-md rounded-md">
      <span className="text-sm">{prize.name}</span>
      <Image
        className="w-50 h-50 object-contain"
        width={200}
        height={200}
        src={prize.img}
        alt={`${prize.name} prize.`}
      />
    </div>
  );
}
