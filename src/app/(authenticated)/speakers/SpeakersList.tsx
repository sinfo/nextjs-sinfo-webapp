"use client";
import GridList from "@/components/GridList";
import { SpeakerTile } from "@/components/speaker";
import { useState } from "react";

interface SpeakersListProps {
  speakers: Speaker[];
}

export default function SpeakersList({ speakers }: SpeakersListProps) {
  const [filteredSpeakers, setFilteredSpeakers] = useState<Speaker[]>(speakers);
  let debounce: NodeJS.Timeout;

  function handleSearch(text: string) {
    debounce && clearTimeout(debounce);
    debounce = setTimeout(() => {
      if (text === "") {
        setFilteredSpeakers(speakers);
      } else {
        setFilteredSpeakers(
          speakers.filter(
            (speaker) =>
              speaker.name.toLowerCase().includes(text.toLowerCase()) ||
              speaker.company?.name.toLowerCase().includes(text.toLowerCase()),
          ),
        );
      }
    }, 300);
  }

  return (
    <>
      <div className="sticky top-0 pt-4 px-4">
        <input
          type="text"
          placeholder="Search speakers"
          className="w-full p-2 border rounded-md shadow-md"
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
        />
      </div>
      <GridList title="Speakers">
        {filteredSpeakers.length === 0 && <div>No speakers found</div>}
        {filteredSpeakers.map((c) => (
          <SpeakerTile key={c.id} speaker={c} />
        ))}
      </GridList>
    </>
  );
}
