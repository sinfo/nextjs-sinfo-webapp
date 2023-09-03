import type { Metadata } from "next";
import { Montserrat } from "next/font/google";

import "../styles/globals.css";
import Navbar from "@/components/Navbar";
import NextAuthProvider from "../context/NextAuthProvider";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SINFO WebApp",
  description: "SINFO WebApp",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <NextAuthProvider>
          <div className="bg-cloudy text-white min-h-screen flex flex-col">
            <Navbar />
            <div className="grow">{children}</div>
          </div>
        </NextAuthProvider>
      </body>
    </html>
  );
}
