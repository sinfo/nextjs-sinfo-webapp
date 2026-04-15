"use client";

import Image from "next/image";
import { useState } from "react";

interface AvatarProps {
  name: string;
  src?: string;
  alt?: string;
  size?: number;
  className?: string;
  imageClassName?: string;
  fallbackClassName?: string;
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (!parts.length) return "?";

  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function Avatar({
  name,
  src,
  alt,
  size = 64,
  className = "",
  imageClassName = "",
  fallbackClassName = "",
}: AvatarProps) {
  const [hasImageError, setHasImageError] = useState(false);
  const initials = getInitials(name);
  const showImage = !!src && !hasImageError;

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-full ${className}`}
      style={{ width: size, height: size }}
    >
      {showImage ? (
        <Image
          className={`h-full w-full object-cover ${imageClassName}`}
          width={size}
          height={size}
          src={src}
          alt={alt ?? name}
          onError={() => setHasImageError(true)}
        />
      ) : (
        <div
          className={`flex h-full w-full items-center justify-center bg-gradient-to-br from-sinfo-quinary to-sinfo-primary font-semibold text-white uppercase ${fallbackClassName}`}
          style={{ fontSize: Math.max(12, Math.round(size * 0.32)) }}
          aria-label={alt ?? name}
        >
          {initials}
        </div>
      )}
    </div>
  );
}
