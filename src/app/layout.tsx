import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import "@/styles/globals.css";
import AuthProvider from "@/context/AuthProvider";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SINFO Web App",
  description: "SINFO Web App",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: true,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className={montserrat.className}>{children}</body>
      </AuthProvider>
    </html>
  );
}
