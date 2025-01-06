import GridCard from "@/components/GridCard";

interface SpeakerTileProps {
  speaker: Speaker;
}

export function SpeakerTile({ speaker }: SpeakerTileProps) {
  return (
    <GridCard
      title={speaker.name}
      img={speaker.img}
      imgAltText={`${speaker.name} picture`}
      extraImage={speaker.companyImg}
    />
  );
}
