"use client";

import List from "@/components/List";
import { SessionTile } from "@/components/session";
import { useState } from "react";

interface PrizeSessionsProps {
  sessions: SINFOSession[];
  compressedSize?: number;
}

export default function PrizeSessions({
  sessions,
  compressedSize = 3,
}: PrizeSessionsProps) {
  const [expandList, setExpandList] = useState(false);

  return (
    <div className="flex flex-col gap-y-2 py-2">
      <span className="text-sm text-gray-600">
        To win the prize above, go to a session below:
      </span>
      {sessions.slice(0, expandList ? undefined : compressedSize).map((s) => (
        <SessionTile key={s.id} session={s} />
      ))}
      {sessions.length > compressedSize && (
        <label
          role="button"
          className="text-sm font-semibold hover:cursor-pointer"
          onClick={() => setExpandList((e) => !e)}
        >
          {expandList ? "Show less" : "Show more sessions"}
        </label>
      )}
    </div>
  );
}
