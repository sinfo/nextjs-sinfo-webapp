import GridCard from "@/components/GridCard";

interface SpeakerTileProps {
  name: string;
  img: string;
  companyImg?: string;
}

export function SpeakerTile({ name, img, companyImg }: SpeakerTileProps) {
  return (
    <GridCard
      title={name}
      img={img}
      imgAltText={`${name} picture`}
      extraImage={companyImg}
    />
  );
}
