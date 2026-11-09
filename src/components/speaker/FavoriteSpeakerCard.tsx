"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  GripVertical,
  MapPin,
  Mic,
  Star,
} from "lucide-react";
import { generateTimeInterval, getSessionColor } from "@/utils/utils";

interface FavoriteSpeakerCardProps {
  speaker: Speaker;
  index: number;
  total: number;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onRemove: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  isDragging?: boolean;
}

export function FavoriteSpeakerCard({
  speaker,
  index,
  total,
  onMoveLeft,
  onMoveRight,
  onRemove,
  onDragStart,
  onDragOver,
  onDragEnd,
  onDrop,
  isDragging = false,
}: FavoriteSpeakerCardProps) {
  const primarySession =
    speaker.sessions && speaker.sessions.length > 0
      ? speaker.sessions[0]
      : undefined;

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onDrop={onDrop}
      className={`group relative flex flex-col justify-between w-[280px] sm:w-[300px] shrink-0 bg-white rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200 overflow-hidden ${
        isDragging ? "opacity-40 scale-95 border-dashed border-amber-400" : ""
      }`}
    >
      <div className="flex items-center justify-between px-3 py-1.5 bg-gray-50/80 border-b border-gray-100">
        <div className="flex items-center gap-1">
          <div
            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 p-0.5"
            title="Drag to reorder"
            aria-label="Drag to reorder"
          >
            <GripVertical className="w-3.5 h-3.5" />
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onMoveLeft();
            }}
            disabled={index === 0}
            className="p-1 rounded text-gray-500 hover:bg-gray-200/80 hover:text-gray-900 disabled:opacity-25 disabled:pointer-events-none transition-colors"
            title="Move left"
            aria-label="Move left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onMoveRight();
            }}
            disabled={index === total - 1}
            className="p-1 rounded text-gray-500 hover:bg-gray-200/80 hover:text-gray-900 disabled:opacity-25 disabled:pointer-events-none transition-colors"
            title="Move right"
            aria-label="Move right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <span className="text-[11px] font-medium text-gray-400 ml-1">
            #{index + 1}
          </span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove();
          }}
          className="p-1 rounded-full text-amber-500 hover:bg-amber-50 hover:scale-110 transition-all"
          title="Remove from favorites"
          aria-label="Remove from favorites"
        >
          <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
        </button>
      </div>

      <Link
        href={`/speakers/${speaker.id}`}
        className="flex flex-col flex-1 p-3.5 justify-between hover:bg-slate-50/50 transition-colors"
      >
        <div>
          <div className="flex items-center gap-3">
            <div className="relative w-14 h-14 shrink-0 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
              <Image
                src={speaker.img}
                alt={`${speaker.name} picture`}
                width={56}
                height={56}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col min-w-0 flex-1">
              <h4
                className="font-bold text-sm text-gray-900 truncate group-hover:text-sinfo-primary transition-colors"
                title={speaker.name}
              >
                {speaker.name}
              </h4>
              <p
                className="text-xs text-gray-500 truncate"
                title={speaker.title}
              >
                {speaker.title}
              </p>
              {speaker.company?.name && (
                <div className="flex items-center gap-1.5 mt-0.5">
                  {speaker.company.img && (
                    <Image
                      src={speaker.company.img}
                      alt={speaker.company.name}
                      width={16}
                      height={16}
                      className="w-3.5 h-3.5 object-contain"
                    />
                  )}
                  <span className="text-[11px] text-gray-600 truncate font-medium">
                    {speaker.company.name}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-gray-100 flex flex-col gap-1.5">
            {primarySession ? (
              <>
                <div className="flex items-start gap-1.5 text-xs font-semibold text-gray-800">
                  <Mic className="w-3.5 h-3.5 text-sinfo-primary shrink-0 mt-0.5" />
                  <span className="line-clamp-2" title={primarySession.name}>
                    {primarySession.name}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-gray-500 mt-0.5">
                  <div className="flex items-center gap-1">
                    <CalendarClock className="w-3 h-3 text-gray-400 shrink-0" />
                    <span>
                      {generateTimeInterval(
                        primarySession.date,
                        primarySession.duration,
                        { onlyHours: false },
                      )}
                    </span>
                  </div>

                  {primarySession.place && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                      <span>{primarySession.place}</span>
                    </div>
                  )}
                </div>

                {primarySession.kind && (
                  <div className="mt-1">
                    <span
                      className="text-[10px] uppercase font-bold text-white px-1.5 py-0.5 rounded inline-block"
                      style={{
                        backgroundColor: getSessionColor(primarySession.kind),
                      }}
                    >
                      {primarySession.kind}
                    </span>
                  </div>
                )}
              </>
            ) : (
              <div className="text-xs text-gray-400 italic py-1">
                No scheduled talk
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
