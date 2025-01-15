"use client";

import { Mail, Trophy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

interface PrizeTileProps {
  prize: Prize;
  participants?: User[];
  pickWinner?: boolean;
}

export function PrizeTile({
  prize,
  participants,
  pickWinner = false,
}: PrizeTileProps) {
  const [winner, setWinner] = useState<User | null>(null);
  const { width: windowWidth, height: windowHeight } = useWindowSize();

  function handlePickWinner() {
    if (participants) {
      const winnerIndex = Math.floor(
        Math.random() * (participants.length || 0),
      );
      setWinner(participants[winnerIndex]);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center text-center py-6 px-2 gap-y-2 bg-white shadow-md rounded-md">
      <span className="text-sm">{prize.name}</span>
      <Image
        className="w-50 h-50 object-contain"
        width={200}
        height={200}
        src={prize.img}
        alt={`${prize.name} prize.`}
      />
      {winner && (
        <div className="flex flex-col justify-center items-center text-center gap-y-2 w-full">
          <Confetti
            width={windowWidth}
            height={windowHeight}
            numberOfPieces={500}
            recycle={false}
          />
          <Image
            className="w-32 h-32 object-contain"
            width={128}
            height={128}
            src={winner.img}
            alt={winner.name}
          />
          <span className="">{winner.name}</span>
          <Link
            className="button button-primary text-sm w-full"
            href={`mailto:${winner.mail}?subject=%5BSINFO%5D%20-%20Prize%20winner`}
          >
            <Mail size={16} />
            Send email
          </Link>
        </div>
      )}
      {pickWinner && participants && !winner && (
        <>
          <button
            className={`button button-primary text-sm w-full`}
            onClick={handlePickWinner}
            disabled={participants.length === 0}
          >
            <Trophy size={16} />
            Pick a winner
          </button>
          <span className="text-xs text-gray-500">
            Participants available to the prize: {participants.length}
          </span>
        </>
      )}
    </div>
  );
}
