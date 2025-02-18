"use client";

import { UserService } from "@/services/UserService";
import { Mail, Trophy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

export type PrizeParticipant = {
  userId: string;
  entries?: number;
};

interface PrizeTileProps {
  prize: Prize;
  participants?: PrizeParticipant[];
  pickWinner?: boolean;
  cannonToken?: string;
}

export function PrizeTile({
  prize,
  participants,
  cannonToken,
  pickWinner = false,
}: PrizeTileProps) {
  const [winner, setWinner] = useState<User>();
  const { width: windowWidth, height: windowHeight } = useWindowSize();

  async function handlePickWinner() {
    if (participants?.length && cannonToken) {
      // All the participants should at least have one entry
      const totalEntries = participants.reduce(
        (acc, p) => acc + (p.entries || 1),
        0,
      );
      let selectedEntry = Math.floor(Math.random() * totalEntries);

      // This function finds the winner by summing the entries
      // of each participant until the random number belongs
      // to the selected participant.
      const winner = participants.find((p) => {
        const participantEntries = p.entries || 1;
        selectedEntry -= participantEntries;
        return selectedEntry < 0;
      })!;

      const user = await UserService.getUser(cannonToken, winner.userId);
      if (!user) {
        console.error("Failed to get prize winner", winner.userId);
        return;
      }

      setWinner(user);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center text-center py-6 px-2 gap-y-2 bg-white shadow-md rounded-md">
      <span className="text-sm">{prize.name}</span>
      <Image
        className="w-[200px] h-[200px] object-contain"
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
