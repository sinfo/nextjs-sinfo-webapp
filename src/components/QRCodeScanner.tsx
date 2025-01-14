"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";

interface QRCodeScannerProps {
  onQRCodeScanned(qrCode: string): void;
  topCard?: ReactNode;
  bottomCard?: ReactNode;
}

const TIMEOUT_SCAN: number = 2000; // Number of miliseconds before read next QR-Code

export default function QRCodeScanner({
  onQRCodeScanned,
  topCard,
  bottomCard,
}: QRCodeScannerProps) {
  const scannerRef = useRef<QrScanner>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [failedToRender, setFailedToRender] = useState<boolean>(false);
  const [scanning, setScanning] = useState<boolean>(true);

  useEffect(() => {
    if (videoRef.current && !scannerRef.current) {
      scannerRef.current = new QrScanner(
        videoRef.current,
        (result) => {
          if (result.data && scanning) {
            setScanning(false);
            setTimeout(() => setScanning(true), TIMEOUT_SCAN);
            onQRCodeScanned(result.data);
          }
        },
        {
          preferredCamera: "environment",
          highlightScanRegion: true,
        },
      );

      scannerRef.current
        .start()
        .then(() => {
          console.log("QR Code scanner started");
        })
        .catch((error) => {
          console.error("QR Code scanner failed to start", error);
          setFailedToRender(true);
        });
    }

    return () => {
      console.log("QR Code scanner stopped");
      if (!videoRef.current) scannerRef.current?.stop();
    };
  }, [scanning, onQRCodeScanned]);

  if (failedToRender) {
    return (
      <div className="flex flex-col justify-center items-center text-center gap-y-2 p-4">
        <p>Failed to render scanner! Please refresh the page and try again.</p>
        <button className="text-link" onClick={() => window.location.reload()}>
          Click here to refresh
        </button>
      </div>
    );
  }

  return (
    <div
      id="scan-container"
      className="relative h-full w-full bg-black overflow-hidden"
    >
      {topCard && (
        <div className="absolute top-4 left-4 right-4 z-50">{topCard}</div>
      )}
      <video
        ref={videoRef}
        className="h-full w-full object-cover overflow-hidden"
      />
      {bottomCard && (
        <div className="absolute bottom-4 left-4 right-4 z-50">
          {bottomCard}
        </div>
      )}
    </div>
  );
}
