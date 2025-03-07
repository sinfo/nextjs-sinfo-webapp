"use client";

import MessageCard from "@/components/MessageCard";
import QRCodeScanner from "@/components/QRCodeScanner";
import { UserTile } from "@/components/user/UserTile";
import { AchievementService } from "@/services/AchievementService";
import { CompanyService } from "@/services/CompanyService";
import {
  getAchievementFromQRCode,
  getUserFromQRCode,
  isCompany,
  pushToHistory,
} from "@/utils/utils";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";

interface QRScannerProps {
  user: User;
  cannonToken: string;
}

export default function QRScanner({ user, cannonToken }: QRScannerProps) {
  const [bottomCard, setBottomCard] = useState<ReactNode | undefined>();
  const [statusCard, setStatusCard] = useState<ReactNode | undefined>();
  const cardsTimeout = useRef<NodeJS.Timeout>();

  const handleQRCodeScanned = useCallback(
    async (data: string) => {
      cardsTimeout.current && clearTimeout(cardsTimeout.current);

      const scannedUser = getUserFromQRCode(data);
      const scannedAchievement = getAchievementFromQRCode(data);

      if (scannedUser) {
        setBottomCard(<UserTile user={scannedUser} />);
        if (isCompany(user.role) && user.company?.length) {
          const signedUser = await CompanyService.sign(
            cannonToken,
            user.company[0].company,
            scannedUser.id,
          );
          if (signedUser) {
            setStatusCard(
              <MessageCard type="info" content="User got its achievement." />,
            );
          } else {
            setStatusCard(
              <MessageCard
                type="warning"
                content="Failed to get user's achievement. Scan again!"
              />,
            );
          }
        }
        pushToHistory(data);
      } else if (scannedAchievement) {
        const redeemedAchievement =
          await AchievementService.redeemSecretAchievement(
            cannonToken,
            scannedAchievement,
          );

        if (redeemedAchievement) {
          setBottomCard(
            <MessageCard type="success" content="Achievement redeemed!" />,
          );
        } else {
          setBottomCard(
            <MessageCard
              type="warning"
              content="Failed to redeem achievement. Scan again!"
            />,
          );
        }
      } else {
        setBottomCard(<MessageCard type="danger" content="Invalid QR-Code" />);
      }

      cardsTimeout.current = setTimeout(() => {
        setBottomCard(null);
        setStatusCard(null);
      }, 10 * 1000); // 10 seconds
    },
    [cannonToken, user.role, user.company],
  );

  useEffect(() => {
    setBottomCard((card) => (
      <div className="flex flex-col justify-start gap-y-1">
        {statusCard}
        {card}
      </div>
    ));
  }, [statusCard]);

  return (
    <QRCodeScanner
      onQRCodeScanned={handleQRCodeScanned}
      bottomCard={bottomCard}
    />
  );
}
