"use client";

import ListCard from "@/components/ListCard";
import MessageCard from "@/components/MessageCard";
import QRCodeScanner from "@/components/QRCodeScanner";
import { UserTile } from "@/components/user/UserTile";
import { UserService } from "@/services/UserService";
import { getUserFromQRCode } from "@/utils/utils";
import { ReactNode, useEffect, useState } from "react";

interface CompanyPromoteScannerProps {
  cannonToken: string;
  company: Company;
}

export default function CompanyPromoteScanner({
  cannonToken,
  company,
}: CompanyPromoteScannerProps) {
  const [topCard, setTopCard] = useState<ReactNode | undefined>();
  const [bottomCard, setBottomCard] = useState<ReactNode | undefined>();
  const [statusCard, setStatusCard] = useState<ReactNode | undefined>();
  let cardsTimeout: NodeJS.Timeout;

  async function handleQRCodeScanned(data: string) {
    const scannedUser = getUserFromQRCode(data);
    cardsTimeout && clearTimeout(cardsTimeout);

    if (scannedUser) {
      setBottomCard(<UserTile user={scannedUser} />);
      if (
        await UserService.promote(cannonToken, scannedUser.id, {
          role: "company",
          company: { company: company.id },
        })
      ) {
        setStatusCard(
          <MessageCard type="success" content="User successfully promoted!" />,
        );
      } else {
        setStatusCard(
          <MessageCard
            type="danger"
            content="Error on promoting user. Try again!"
          />,
        );
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
      <ListCard
        title={company.name}
        img={company.img}
        link={`/companies/${company.id}`}
      />,
    );
  }, [company]);

  return (
    <QRCodeScanner
      onQRCodeScanned={handleQRCodeScanned}
      topCard={topCard}
      bottomCard={bottomCard}
    />
  );
}
