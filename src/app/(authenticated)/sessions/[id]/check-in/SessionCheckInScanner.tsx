"use client";

import ListCard from "@/components/ListCard";
import MessageCard from "@/components/MessageCard";
import QRCodeScanner from "@/components/QRCodeScanner";
import { SessionTile } from "@/components/session";
import { SessionService } from "@/services/SessionService";
import { getUserFromQRCode } from "@/utils/utils";
import { Ghost, UserMinus, UserPlus, Users } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";

interface SessionCheckInScannerProps {
  cannonToken: string;
  sinfoSession: SINFOSession;
}

export default function SessionCheckInScanner({
  cannonToken,
  sinfoSession,
}: SessionCheckInScannerProps) {
  const [status, setStatus] = useState({
    participantsNumber: sinfoSession.participants?.length || 0,
    unauthenticatedParticipantsNumber:
      sinfoSession.unauthenticatedParticipants || 0,
  });
  const [topCard, setTopCard] = useState<ReactNode | undefined>();
  const [bottomCard, setBottomCard] = useState<ReactNode | undefined>();
  const [statusCard, setStatusCard] = useState<ReactNode | undefined>();
  let cardsTimeout: NodeJS.Timeout;

  async function handleQRCodeScanned(data: string) {
    const scannedUser = getUserFromQRCode(data);
    cardsTimeout && clearTimeout(cardsTimeout);

    if (scannedUser) {
      setBottomCard(
        <ListCard img={scannedUser.img} title={scannedUser.name} />,
      );
      const sessionStatus = await SessionService.checkInUser(
        cannonToken,
        sinfoSession.id,
        {
          users: [scannedUser.id],
        },
      );
      if (!sessionStatus)
        setStatusCard(
          <MessageCard
            type="danger"
            content="Failed to check-in user. Try again!"
          />,
        );
      else {
        if (sessionStatus.status === "already")
          setStatusCard(
            <MessageCard type="warning" content="Already checked in" />,
          );
        else if (sessionStatus.status === "success")
          setStatusCard(
            <MessageCard type="success" content="User checked in" />,
          );
        else
          setStatusCard(
            <MessageCard type="danger" content="Invalid QR-Code" />,
          );
        setStatus({
          unauthenticatedParticipantsNumber:
            sessionStatus.unauthenticatedParticipantsNumber,
          participantsNumber: sessionStatus.participantsNumber,
        });
      }
    } else {
      setBottomCard(<MessageCard type="danger" content="Invalid QR-Code" />);
    }

    cardsTimeout = setTimeout(() => {
      setBottomCard(null);
      setStatusCard(null);
    }, 10 * 1000); // 10 seconds
  }

  useEffect(() => {
    setBottomCard((card) => (
      <div className="flex flex-col justify-start gap-y-1">
        {statusCard}
        {card}
      </div>
    ));
  }, [statusCard]);

  useEffect(() => {
    setTopCard(
      <div className="flex flex-col justify-start gap-y-1">
        <SessionTile session={sinfoSession} />
        <div className="flex justify-center items-center gap-x-4">
          <button className="button button-primary !bg-sinfo-secondary flex-1">
            <UserMinus size={32} strokeWidth={1} />
          </button>
          <div className="flex justify-center items-center bg-white rounded-md text-sm flex-1 p-4 gap-x-2">
            <Users size={16} />
            <span>{status.participantsNumber}</span>
            /
            <Ghost size={16} />
            <span>{status.unauthenticatedParticipantsNumber}</span>
          </div>
          <button className="button button-primary flex-1">
            <UserPlus size={32} strokeWidth={1} />
          </button>
        </div>
      </div>,
    );
  }, [status, sinfoSession]);

  return (
    <QRCodeScanner
      onQRCodeScanned={handleQRCodeScanned}
      topCard={topCard}
      bottomCard={bottomCard}
    />
  );
}
