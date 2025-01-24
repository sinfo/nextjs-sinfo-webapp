"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { useWindowSize } from "react-use";

interface ShowMoreProps {
  lines: 1 | 2 | 3 | 4 | 5 | 6;
  children: ReactNode;
  className?: string;
}

const lineClamps = [
  "line-clamp-1",
  "line-clamp-2",
  "line-clamp-3",
  "line-clamp-4",
  "line-clamp-5",
  "line-clamp-6",
];

export function ShowMore({ lines, children, className }: ShowMoreProps) {
  const textRef = useRef<HTMLParagraphElement>(null);
  const [showButton, setShowButton] = useState<boolean>(true);
  const [showMore, setShowMore] = useState<boolean>(false);
  const { width: windowWidth } = useWindowSize();

  useEffect(() => {
    setShowButton(
      (textRef.current?.clientHeight ?? 0) <
        (textRef.current?.scrollHeight ?? 1),
    );
  }, [lines, windowWidth]);

  return (
    <span className={className}>
      <p
        ref={textRef}
        className={`w-full ${showMore ? "" : lineClamps[lines - 1]}`}
      >
        {children}
      </p>
      {showButton && (
        <label
          role="button"
          className="font-semibold hover:cursor-pointer hover:underline"
          onClick={() => setShowMore((s) => !s)}
        >
          {showMore ? "Show less" : "Show more"}
        </label>
      )}
    </span>
  );
}
