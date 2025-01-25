"use client";

import ListCard from "@/components/ListCard";
import MessageCard from "@/components/MessageCard";
import QRCodeScanner from "@/components/QRCodeScanner";
import { SessionTile } from "@/components/session";
import { SessionService } from "@/services/SessionService";
import { getUserFromQRCode } from "@/utils/utils";
import { Ghost, ScanEye, UserMinus, UserPlus, Users } from "lucide-react";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";

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
    unregisteredParticipantsNumber: sinfoSession.unregisteredParticipants || 0,
  });
  const [topCard, setTopCard] = useState<ReactNode | undefined>();
  const [bottomCard, setBottomCard] = useState<ReactNode | undefined>();
  const [statusCard, setStatusCard] = useState<ReactNode | undefined>();
  const [unregisteredUsersCounter, setUnregisteredUsersCounter] =
    useState<number>(0);
  const cardsTimeout = useRef<NodeJS.Timeout>();
  const updateSessionStatusTimeout = useRef<NodeJS.Timeout>();

  const sessionUpdate = useCallback(
    async (data?: { users?: string[]; unregisteredUsers?: number }) => {
      const sessionStatus = await SessionService.checkInUser(
        cannonToken,
        sinfoSession.id,
        data || {},
      );
      if (sessionStatus) {
        updateSessionStatusTimeout.current &&
          clearTimeout(updateSessionStatusTimeout.current);
        updateSessionStatusTimeout.current = setTimeout(
          () => sessionUpdate(),
          5 * 1000,
        ); // Update every 5 seconds
        setStatus({
          participantsNumber: sessionStatus.participantsNumber,
          unregisteredParticipantsNumber:
            sessionStatus.unregisteredParticipantsNumber,
        });
      }
      return sessionStatus;
    },
    [cannonToken, sinfoSession.id],
  );

  const handleQRCodeScanned = useCallback(
    async (data: string) => {
      const scannedUser = getUserFromQRCode(data);
      cardsTimeout.current && clearTimeout(cardsTimeout.current);

      if (scannedUser) {
        setBottomCard(
          <ListCard img={scannedUser.img} title={scannedUser.name} />,
        );
        const sessionStatus = await sessionUpdate({ users: [scannedUser.id] });
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
        }
      } else {
        setBottomCard(<MessageCard type="danger" content="Invalid QR-Code" />);
      }

      cardsTimeout.current = setTimeout(() => {
        setBottomCard(null);
        setStatusCard(null);
      }, 10 * 1000); // 10 seconds
    },
    [sessionUpdate],
  );

  const handleUnregisteredUser = useCallback(
    async (count: number) => {
      const sessionStatus = sessionUpdate({ unregisteredUsers: count });
      if (!sessionStatus) {
        setBottomCard(
          <MessageCard
            type="danger"
            content="Failed to update unregistered users"
          />,
        );
      } else {
        setBottomCard(
          <MessageCard
            type="success"
            content={
              count > 0
                ? `Added ${count} unregistered user`
                : `Removed ${count} unregistered user`
            }
          />,
        );
        setUnregisteredUsersCounter((c) => c + count);
      }
    },
    [sessionUpdate],
  );

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
          <button
            className="button button-primary !bg-sinfo-secondary flex-1"
            onClick={() => handleUnregisteredUser(-1)}
            disabled={unregisteredUsersCounter <= 0}
          >
            <UserMinus size={32} strokeWidth={1} />
          </button>
          <div className="flex justify-center items-center bg-white rounded-md text-sm flex-1 p-4 gap-x-2">
            <Users size={16} />
            <span>{status.participantsNumber}</span>
            /
            <Ghost size={16} />
            <span>{status.unregisteredParticipantsNumber}</span>
            /
            <ScanEye size={16} />
            <span>{unregisteredUsersCounter}</span>
          </div>
          <button
            className="button button-primary flex-1"
            onClick={() => handleUnregisteredUser(1)}
          >
            <UserPlus size={32} strokeWidth={1} />
          </button>
        </div>
      </div>,
    );
  }, [status, sinfoSession, handleUnregisteredUser, unregisteredUsersCounter]);

  useEffect(() => {
    sessionUpdate();
  }, [sessionUpdate]);

  return (
    <QRCodeScanner
      onQRCodeScanned={handleQRCodeScanned}
      topCard={topCard}
      bottomCard={bottomCard}
    />
  );
}
