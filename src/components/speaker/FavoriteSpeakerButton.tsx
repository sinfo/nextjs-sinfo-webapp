"use client";

import { useFavorites } from "@/context/FavoritesContext";
import { Star } from "lucide-react";
import React from "react";

interface FavoriteSpeakerButtonProps {
  speakerId: string;
  variant?: "icon" | "button";
  className?: string;
  size?: number;
}

export function FavoriteSpeakerButton({
  speakerId,
  variant = "icon",
  className = "",
  size = 18,
}: FavoriteSpeakerButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(speakerId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(speakerId);
  };

  if (variant === "button") {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
        className={`flex items-center justify-center gap-2 px-3 py-1.5 rounded-full font-medium text-xs sm:text-sm transition-all duration-200 border shadow-sm ${
          favorited
            ? "bg-amber-50 text-amber-600 border-amber-300 hover:bg-amber-100"
            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-amber-600 hover:border-amber-300"
        } ${className}`}
      >
        <Star
          size={size}
          className={`transition-transform duration-200 ${
            favorited
              ? "fill-amber-400 text-amber-500 scale-110"
              : "text-gray-400"
          }`}
        />
        <span>{favorited ? "Favorited" : "Add to favorites"}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
      title={favorited ? "Remove from favorites" : "Add to favorites"}
      className={`p-1.5 rounded-full transition-all duration-200 flex items-center justify-center ${
        favorited
          ? "bg-amber-50 text-amber-500 hover:bg-amber-100 shadow-sm"
          : "bg-white/90 text-gray-400 hover:text-amber-500 hover:bg-white shadow-sm border border-gray-100"
      } ${className}`}
    >
      <Star
        size={size}
        className={`transition-transform duration-200 ${
          favorited
            ? "fill-amber-400 text-amber-500 scale-110"
            : "hover:scale-105"
        }`}
      />
    </button>
  );
}
