"use client";

import { UserService } from "@/services/UserService";
import { isAttendee } from "@/utils/utils";
import { Mail, Trophy, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { PrizeDrawAnimation } from "./PrizeDrawAnimation";

export type PrizeParticipant = {
  userId: string;
  entries?: number;
};

interface PrizeTileProps {
  prize: Prize;
  participants?: PrizeParticipant[];
  pickWinner?: boolean;
  cannonToken?: string;
  disableAnimation?: boolean;
}

export function PrizeTile({
  prize,
  participants,
  cannonToken,
  pickWinner = false,
  disableAnimation = false,
}: PrizeTileProps) {
  const [winner, setWinner] = useState<User>();
  const [participantUsers, setParticipantUsers] = useState<User[]>([]);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const { width: windowWidth, height: windowHeight } = useWindowSize();

  // Prevent body scroll when overlay is open
  useEffect(() => {
    if (isOverlayOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOverlayOpen]);

  async function handlePickWinner() {
    if (participants?.length && cannonToken) {
      // Open overlay immediately to create a full-screen experience
      if (!disableAnimation) {
        setIsOverlayOpen(true);
      }

      // Fetch participant user data and filter for eligible attendees only
      const userPromises = participants.map((p) =>
        UserService.getUser(cannonToken, p.userId),
      );
      const users = await Promise.all(userPromises);
      const eligibleUsers = users.filter(
        (u): u is User => u !== null && isAttendee(u.role),
      );
      const eligibleUserIds = new Set(eligibleUsers.map((u) => u.id));

      const eligibleParticipants = participants.filter((p) =>
        eligibleUserIds.has(p.userId),
      );

      if (!disableAnimation) {
        setParticipantUsers(eligibleUsers);
      }

      if (eligibleParticipants.length === 0) {
        console.error("No eligible participants available for this prize draw");
        setIsOverlayOpen(false);
        return;
      }

      // All the participants should at least have one entry
      const totalEntries = eligibleParticipants.reduce(
        (acc, p) => acc + (p.entries || 1),
        0,
      );
      let selectedEntry = Math.floor(Math.random() * totalEntries);

      // This function finds the winner by summing the entries
      // of each participant until the random number belongs
      // to the selected participant.
      const winnerParticipant = eligibleParticipants.find((p) => {
        const participantEntries = p.entries || 1;
        selectedEntry -= participantEntries;
        return selectedEntry < 0;
      })!;

      const winnerUser = await UserService.getUser(
        cannonToken,
        winnerParticipant.userId,
      );
      if (!winnerUser) {
        console.error("Failed to get prize winner", winnerParticipant.userId);
        return;
      }

      setWinner(winnerUser);

      // Start animation after we have all the data
      setShowAnimation(!disableAnimation);
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
      {winner && !isOverlayOpen && (
        <div className="flex flex-col justify-center items-center text-center gap-y-2 w-full">
          {disableAnimation && (
            <Confetti
              width={windowWidth}
              height={windowHeight}
              numberOfPieces={500}
              recycle={false}
            />
          )}
          <Link href={`/users/${winner.id}`}>
            <Image
              className="size-[128px] object-contain"
              width={128}
              height={128}
              src={winner.img}
              alt={winner.name}
            />
          </Link>
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

      {/* Full-screen overlay positioned below navbar */}
      {isOverlayOpen && (
        <div className="fixed left-0 right-0 bottom-0 top-16 z-[9] bg-white/95 backdrop-blur-sm overflow-hidden">
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-6">
            {/* Close button (top-right) */}
            <button
              aria-label="Close"
              className="absolute right-4 top-4 inline-flex items-center justify-center rounded-md border border-gray-200 bg-white/80 p-2 shadow-sm z-10"
              onClick={() => {
                setIsOverlayOpen(false);
                setShowAnimation(false);
              }}
            >
              <X size={20} />
            </button>

            {/* Show animation or winner result */}
            {showAnimation && winner && participantUsers.length > 0 ? (
              <div className="w-full h-full max-w-2xl">
                <PrizeDrawAnimation
                  participants={participantUsers}
                  winner={winner}
                  prize={prize}
                  onAnimationComplete={() => {
                    // Animation is complete, keep showing the winner
                  }}
                />
              </div>
            ) : winner ? (
              /* Fallback to original winner display if animation not ready */
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="flex items-center gap-2 text-sinfo-primary">
                  <Trophy size={24} />
                  <span className="text-base font-medium">{prize.name}</span>
                </div>
                <Confetti
                  width={windowWidth}
                  height={windowHeight}
                  numberOfPieces={500}
                  recycle={false}
                />
                <Link href={`/users/${winner.id}`}>
                  <Image
                    className="size-[160px] rounded-full object-cover shadow-md"
                    width={160}
                    height={160}
                    src={winner.img}
                    alt={winner.name}
                  />
                </Link>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-xl font-semibold">{winner.name}</span>
                  <Link
                    className="button button-primary text-sm min-w-48"
                    href={`mailto:${winner.mail}?subject=%5BSINFO%5D%20-%20Prize%20winner`}
                  >
                    <Mail size={16} />
                    Send email
                  </Link>
                </div>
                <button
                  className="button button-secondary text-sm"
                  onClick={() => {
                    setIsOverlayOpen(false);
                    setShowAnimation(false);
                  }}
                >
                  Close
                </button>
              </div>
            ) : (
              /* Loading state while fetching participants */
              <div className="flex flex-col items-center gap-3">
                <Trophy
                  className="animate-bounce text-sinfo-primary"
                  size={48}
                />
                <span className="text-sm text-gray-600">
                  Preparing the draw…
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
