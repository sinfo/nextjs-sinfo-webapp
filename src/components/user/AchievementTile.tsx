"use client";

import Modal from "@/components/Modal";
import Image from "next/image";
import { useState } from "react";

interface AchievementTileProps {
  achievement: Achievement;
  achieved?: boolean;
}

export default function AchievementTile({
  achievement,
  achieved = false,
}: AchievementTileProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        className={`max-w-30 max-h-30 rounded-full shadow-md cursor-pointer ${achieved ? "bg-white" : "bg-gray-200 grayscale opacity-25"}`}
        onClick={() => setIsOpen(true)}
      >
        <Image
          title={achievement.name}
          className={`object-contain`}
          width={80}
          height={80}
          src={achievement.img}
          alt={`${achievement.name} achievement`}
        />
      </div>
      {/* Modal Information */}
      <Modal open={isOpen} onClose={() => setIsOpen(false)}>
        <div className="flex flex-col justify-center items-center text-center gap-y-2">
          <Image
            title={achievement.name}
            className={`object-contain ${achieved ? "" : "grayscale opacity-25"}`}
            width={150}
            height={150}
            src={achievement.img}
            alt={`${achievement.name} achievement`}
          />
          <span>{achievement.name}</span>
          {achievement.description && (
            <p className="text-xs">{achievement.description}</p>
          )}
          <span className="text-gray-500">Value: {achievement.value}</span>
        </div>
      </Modal>
    </>
  );
}
