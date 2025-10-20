"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface PrizeDrawAnimationProps {
  participants: User[];
  winner: User;
  prize: Prize;
  onAnimationComplete?: () => void;
}

type ParticipantPosition = {
  user: User;
  startX: number;
  delay: number;
  inHat: boolean;
};

export function PrizeDrawAnimation({
  participants,
  winner,
  prize,
  onAnimationComplete,
}: PrizeDrawAnimationProps) {
  const [participantPositions, setParticipantPositions] = useState<
    ParticipantPosition[]
  >([]);
  const [isShaking, setIsShaking] = useState(false);
  const [showWinner, setShowWinner] = useState(false);
  const [showPrize, setShowPrize] = useState(false);
  const [animationDuration, setAnimationDuration] = useState(1000);

  useEffect(() => {
    // Calculate dynamic timing based on participant count
    // For few participants (<=10): keep original timing (150ms stagger, 1000ms animation)
    // For many participants (>10): scale down to fit in ~5 seconds total
    const participantCount = participants.length;
    let calculatedStagger = 150;
    let calculatedDuration = 1000;
    
    if (participantCount > 10) {
      // Target total time of 5 seconds for the dropping phase
      const targetTotalTime = 5000;
      // Total time = (last participant delay) + animation duration
      // targetTotalTime = (participantCount - 1) * stagger + duration
      // We want to keep the animation smooth, so minimum duration is 600ms
      calculatedDuration = Math.max(600, targetTotalTime * 0.3);
      calculatedStagger = (targetTotalTime - calculatedDuration) / Math.max(1, participantCount - 1);
      // Ensure minimum stagger for visual effect
      calculatedStagger = Math.max(20, calculatedStagger);
    }
    
    setAnimationDuration(calculatedDuration);

    // Initialize participant positions with random horizontal positions and delays
    const positions = participants.map((user, index) => ({
      user,
      startX: Math.random() * 80 + 10, // Random position between 10% and 90%
      delay: index * calculatedStagger, // Stagger the drops with dynamic timing
      inHat: false,
    }));
    setParticipantPositions(positions);

    // Set up individual timers to mark each participant as "in hat" after their animation completes
    const timers: NodeJS.Timeout[] = [];
    positions.forEach((position, index) => {
      const dropCompleteTime = position.delay + calculatedDuration; // delay + animation duration
      const timer = setTimeout(() => {
        setParticipantPositions((prev) => {
          const updated = [...prev];
          if (updated[index]) {
            updated[index] = { ...updated[index], inHat: true };
          }
          return updated;
        });
      }, dropCompleteTime);
      timers.push(timer);
    });

    // Calculate total drop time
    const totalDropTime = (positions.length - 1) * calculatedStagger + calculatedDuration;

    // Start shaking after all participants have dropped
    const shakeTimer = setTimeout(() => {
      setIsShaking(true);
    }, totalDropTime);

    // Show winner after shaking
    const winnerTimer = setTimeout(() => {
      setIsShaking(false);
      setShowWinner(true);
    }, totalDropTime + 2000); // Shake for 2 seconds

    // Show prize after winner is displayed
    const prizeTimer = setTimeout(() => {
      setShowPrize(true);
      onAnimationComplete?.();
    }, totalDropTime + 3000); // 1 second after winner appears

    return () => {
      timers.forEach(timer => clearTimeout(timer));
      clearTimeout(shakeTimer);
      clearTimeout(winnerTimer);
      clearTimeout(prizeTimer);
    };
  }, [participants, onAnimationComplete]);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Falling participants - they start from above the viewport */}
      {!showWinner && (
        <div className="absolute inset-0 pointer-events-none">
          {participantPositions.map((participant, index) => (
            <div
              key={participant.user.id}
              className="absolute animate-fall"
              style={{
                left: `${participant.startX}%`,
                top: "-100px",
                animationDelay: `${participant.delay}ms`,
                animationDuration: `${animationDuration}ms`,
                animationFillMode: "forwards",
              }}
            >
              <Image
                className="size-12 rounded-full object-cover border-2 border-white shadow-lg"
                width={48}
                height={48}
                src={participant.user.img}
                alt={participant.user.name}
              />
            </div>
          ))}
        </div>
      )}

      {/* Drawing hat */}
      <div
        className={`relative transition-transform duration-200 ${
          isShaking ? "animate-shake" : ""
        } ${showWinner ? "opacity-0 scale-0" : "opacity-100 scale-100"}`}
      >
        {/* Hat SVG - Simple top hat illustration */}
        <svg
          width="200"
          height="200"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-xl"
        >
          {/* Hat brim */}
          <ellipse
            cx="100"
            cy="140"
            rx="80"
            ry="15"
            fill="#2D3748"
            stroke="#1A202C"
            strokeWidth="2"
          />
          {/* Hat body */}
          <path
            d="M 40 140 L 50 80 Q 50 70 60 70 L 140 70 Q 150 70 150 80 L 160 140 Z"
            fill="#4A5568"
            stroke="#2D3748"
            strokeWidth="2"
          />
          {/* Hat top opening (darker to show depth) */}
          <ellipse cx="100" cy="75" rx="40" ry="8" fill="#1A202C" />
          {/* Hat band */}
          <rect
            x="55"
            y="130"
            width="90"
            height="12"
            rx="2"
            fill="#E53E3E"
          />
        </svg>

        {/* Participant count badge */}
        {!showWinner && (
          <div className="absolute -top-4 -right-4 bg-sinfo-primary text-white rounded-full size-12 flex items-center justify-center font-bold text-sm shadow-lg">
            {participantPositions.filter((p) => p.inHat).length}
          </div>
        )}
      </div>

      {/* Winner reveal */}
      {showWinner && (
        <div className="absolute inset-0 flex items-center justify-center animate-winner-reveal">
          <div className="relative flex flex-col items-center gap-6">
            <div className="relative">
              <Image
                className="size-40 rounded-full object-cover shadow-2xl border-4 border-sinfo-primary animate-pulse-slow"
                width={160}
                height={160}
                src={winner.img}
                alt={winner.name}
              />
              {/* Winner crown/badge */}
              <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 rounded-full size-12 flex items-center justify-center shadow-lg">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
              </div>
            </div>
            <span className="text-2xl font-bold text-gray-800 animate-fade-in">
              {winner.name}
            </span>
            
            {/* Prize display - fades in after winner with absolute positioning to prevent layout shift */}
            <div className="relative h-64 w-full flex items-center justify-center">
              {showPrize && (
                <div className="absolute flex flex-col items-center gap-2 animate-prize-fade-in">
                  <Image
                    className="w-48 h-48 object-contain"
                    width={192}
                    height={192}
                    src={prize.img}
                    alt={prize.name}
                  />
                  <span className="text-xl font-medium text-gray-700">
                    {prize.name}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            transform: translateY(calc(50vh + 100px)) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0) rotate(0deg);
          }
          10%,
          30%,
          50%,
          70%,
          90% {
            transform: translateX(-10px) rotate(-5deg);
          }
          20%,
          40%,
          60%,
          80% {
            transform: translateX(10px) rotate(5deg);
          }
        }

        @keyframes winnerReveal {
          0% {
            transform: translateY(100px) scale(0.5);
            opacity: 0;
          }
          50% {
            transform: translateY(-20px) scale(1.1);
          }
          100% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulseSlow {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .animate-fall {
          animation: fall 1s ease-in forwards;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out infinite;
        }

        .animate-winner-reveal {
          animation: winnerReveal 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)
            forwards;
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out 0.3s forwards;
          opacity: 0;
        }

        .animate-pulse-slow {
          animation: pulseSlow 2s ease-in-out infinite;
        }

        .animate-prize-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
