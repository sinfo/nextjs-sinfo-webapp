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
      {/* TODO: Fix search width */}
      <input
        type="text"
        placeholder="Search speakers"
        className="w-[90%] p-2 border mt-4 mx-4 rounded-md shadow-md sticky top-4 border-box"
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
      />
      <GridList title="Speakers">
        {filteredSpeakers.length === 0 && <div>No speakers found</div>}
        {filteredSpeakers.map((c) => (
          <SpeakerTile key={c.id} speaker={c} />
        ))}
      </GridList>
    </>
  );
}
