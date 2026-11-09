"use client";

import GridCard from "@/components/GridCard";
import { FavoriteSpeakerButton } from "./FavoriteSpeakerButton";

interface SpeakerTileProps {
  speaker: Speaker;
}

export function SpeakerTile({ speaker }: SpeakerTileProps) {
  return (
    <GridCard
      title={speaker.name}
      img={speaker.img}
      imgAltText={`${speaker.name} picture`}
      extraImage={speaker.company?.img}
      link={`/speakers/${speaker.id}`}
      action={<FavoriteSpeakerButton speakerId={speaker.id} />}
    />
  );
}
