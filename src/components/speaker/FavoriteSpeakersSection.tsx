"use client";

import React from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { useFavorites } from "@/context/FavoritesContext";
import { FavoriteSpeakerCard } from "./FavoriteSpeakerCard";
import GridList from "@/components/GridList";
import List from "@/components/List";
import { useReorderableList } from "@/hooks/useReorderableList";

interface FavoriteSpeakersSectionProps {
  allSpeakers: Speaker[];
}

export function FavoriteSpeakersSection({
  allSpeakers,
}: FavoriteSpeakersSectionProps) {
  const { favorites, removeFavorite, reorderFavorites } = useFavorites();

  const {
    draggedIdx,
    moveItem,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
  } = useReorderableList(favorites, reorderFavorites);

  const favoriteSpeakers: Speaker[] = favorites
    .map((id) => allSpeakers.find((s) => s.id === id))
    .filter((s): s is Speaker => Boolean(s));

  if (favoriteSpeakers.length === 0) {
    return (
      <List
        title="Favorite Speakers"
        link="/speakers"
        linkText="See all"
        id="favorite-speakers-section"
      >
        <div className="bg-white rounded-lg shadow-sm border border-dashed border-gray-300 p-6 flex flex-col items-center justify-center text-center gap-2">
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
            <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
          </div>
          <p className="font-semibold text-gray-800 text-sm sm:text-base">
            Add your favorite speakers
          </p>
          <p className="text-xs text-gray-500 max-w-sm">
            Mark speakers as favorites to quickly track their talks and schedule
            right here on your home page.
          </p>
          <Link
            href="/speakers"
            className="mt-2 text-xs font-semibold px-4 py-2 bg-sinfo-primary text-white rounded-md shadow hover:bg-opacity-90 transition-colors"
          >
            Explore Speakers
          </Link>
        </div>
      </List>
    );
  }

  return (
    <GridList
      title="Favorite Speakers"
      link="/speakers"
      linkText="See all"
      scrollable
      id="favorite-speakers-section"
    >
      {favoriteSpeakers.map((speaker, index) => (
        <FavoriteSpeakerCard
          key={speaker.id}
          speaker={speaker}
          index={index}
          total={favoriteSpeakers.length}
          onMoveLeft={() => moveItem(index, "left")}
          onMoveRight={() => moveItem(index, "right")}
          onRemove={() => removeFavorite(speaker.id)}
          onDragStart={handleDragStart(index)}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          onDrop={handleDrop(index)}
          isDragging={draggedIdx === index}
        />
      ))}
    </GridList>
  );
}
