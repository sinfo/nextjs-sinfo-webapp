"use client";

import React from "react";
import Link from "next/link";

interface StandProps {
  stand: Stand;
  company: Company | null;
  standPositions: Record<number, { x: number; y: number }>;
  isSelected?: boolean;
  className?: string;
}

const CompanyStand: React.FC<StandProps> = ({
  stand,
  company,
  standPositions,
  isSelected = false,
  className = "",
}) => {
  const standNumber = parseInt(stand.standId);
  const position = standPositions[standNumber];

  if (!position) return null;

  return (
    <a href={company ? `/companies/${company.id}` : "#"} className={className}>
      <g
        className={`
          transition-all duration-200 ease-in-out
          ${company ? "cursor-pointer hover:opacity-80" : "cursor-default"}
          ${isSelected ? "opacity-70" : "opacity-100"}
        `}
      >
        {/* Base stand rectangle */}
        <rect
          x={position.x}
          y={position.y}
          width="26"
          height="26"
          fill={isSelected ? "#E5E7EB" : "white"}
          stroke={isSelected ? "#9CA3AF" : "black"}
          strokeWidth={isSelected ? "2" : "1"}
          className="transition-all duration-200"
        />

        {/* Company logo or stand number */}
        {company?.img ? (
          <image
            href={company.img}
            x={position.x + 3}
            y={position.y + 3}
            width="20"
            height="20"
            preserveAspectRatio="xMidYMid meet"
            className={`
                transition-all duration-200
                ${isSelected ? "opacity-80" : "opacity-100"}
              `}
          />
        ) : company?.name ? (
          <text
            x={position.x + 3}
            y={position.y + 15}
            fontSize="6"
            className={`
              ${company ? "font-medium" : "font-normal"}
              ${isSelected ? "fill-gray-600" : "fill-black"}
            `}
          >
            {company.name}
          </text>
        ) : (
          <text
            x={position.x + (standNumber < 10 ? 9 : 6)}
            y={position.y + 18}
            fontSize="13"
            className={`
          ${company ? "font-medium" : "font-normal"}
          ${isSelected ? "fill-gray-600" : "fill-black"}
        `}
          >
            {standNumber}
          </text>
        )}

        {/* Optional highlight effect for selected state */}
        {isSelected && (
          <rect
            x={position.x - 1}
            y={position.y - 1}
            width="28"
            height="28"
            fill="none"
            stroke="#4F46E5"
            strokeWidth="2"
            className="pointer-events-none"
          />
        )}
      </g>
    </a>
  );
};

export default CompanyStand;
