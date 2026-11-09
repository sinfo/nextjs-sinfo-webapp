"use client";

import GridList from "@/components/GridList";
import { SpeakerTile } from "@/components/speaker";
import { useFavorites } from "@/context/FavoritesContext";
import { Star } from "lucide-react";
import { useMemo, useState } from "react";
import { useDebounce } from "react-use";

interface SpeakersListProps {
  speakers: Speaker[];
}

export default function SpeakersList({ speakers }: SpeakersListProps) {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const { isFavorite, favorites } = useFavorites();

  useDebounce(
    () => {
      setDebouncedSearch(searchInput);
    },
    300,
    [searchInput],
  );

  const filteredSpeakers = useMemo(() => {
    let result = speakers;

    if (onlyFavorites) {
      result = result.filter((speaker) => isFavorite(speaker.id));
    }

    if (debouncedSearch.trim() !== "") {
      const lower = debouncedSearch.toLowerCase();
      result = result.filter(
        (speaker) =>
          speaker.name.toLowerCase().includes(lower) ||
          speaker.company?.name?.toLowerCase().includes(lower) ||
          speaker.title?.toLowerCase().includes(lower),
      );
    }

    return result;
  }, [speakers, debouncedSearch, onlyFavorites, isFavorite]);

  return (
    <>
      <div className="sticky top-16 pt-4 px-4 z-20 flex flex-col gap-2">
        <input
          type="text"
          placeholder="Search speakers"
          className="w-full p-2 border rounded-md shadow-md"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setOnlyFavorites(false)}
            className={`px-3 py-1 text-xs font-semibold rounded-full border transition-colors ${
              !onlyFavorites
                ? "bg-sinfo-primary text-white border-sinfo-primary shadow-sm"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
            }`}
          >
            All ({speakers.length})
          </button>
          <button
            type="button"
            onClick={() => setOnlyFavorites(true)}
            className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full border transition-colors ${
              onlyFavorites
                ? "bg-amber-400 text-gray-900 border-amber-400 shadow-sm"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
            }`}
          >
            <Star
              className={`w-3.5 h-3.5 ${
                onlyFavorites
                  ? "fill-gray-900 text-gray-900"
                  : "text-amber-500 fill-amber-400"
              }`}
            />
            <span>Favorites ({favorites.length})</span>
          </button>
        </div>
      </div>
      <GridList title="Speakers">
        {filteredSpeakers.length === 0 && (
          <div className="w-full text-center py-8 text-gray-500 text-sm">
            {onlyFavorites
              ? "No favorite speakers found. Mark speakers with the star icon to add them!"
              : "No speakers found"}
          </div>
        )}
        {filteredSpeakers.map((c) => (
          <SpeakerTile key={c.id} speaker={c} />
        ))}
      </GridList>
    </>
  );
}
