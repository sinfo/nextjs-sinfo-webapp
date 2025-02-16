"use client";

import {
  getUserActiveSignatureData,
  isAttendee,
  isMember,
} from "@/utils/utils";
import { FerrisWheel } from "lucide-react";
import { ProfileButtonProps } from ".";
import { UserService } from "@/services/UserService";
import { useRouter } from "next/navigation";
import { SPIN_WHEEL_MAXIMUM } from "@/constants";

export default function ValidateSpinButton({
  cannonToken,
  user,
  otherUser,
  edition,
}: ProfileButtonProps) {
  const router = useRouter();

  if (
    user.id === otherUser.id ||
    !isMember(user.role) ||
    !isAttendee(otherUser.role)
  ) {
    return <></>;
  }

  const spinWheelData = getUserActiveSignatureData(otherUser, edition ?? ``);

  const isEligible =
    (spinWheelData &&
      !spinWheelData.redeemed &&
      spinWheelData.signatures.length >= SPIN_WHEEL_MAXIMUM) ??
    false;

  async function validateSpinWheel() {
    const success = await UserService.validateSpinWheel(
      cannonToken,
      otherUser.id
    );
    if (success) router.refresh();
    else alert("Could not validate!");
  }

  return (
    <button
      className="button-tertiary text-sm"
      disabled={!isEligible}
      onClick={validateSpinWheel}
    >
      <FerrisWheel size={16} />
      Validate Spin the Wheel
    </button>
  );
}
