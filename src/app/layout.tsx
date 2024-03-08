import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { getServerSession } from "next-auth";

import "@/styles/globals.css";

import Navbar from "@/components/Navbar";
import BottomNavbar from "@/components/BottomNavbar";
import AuthProvider from "@/context/AuthProvider";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserService } from "@/services/UserService";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SINFO WebApp",
  description: "SINFO WebApp",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const user: User = await UserService.getMe(session!.cannonToken);
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <AuthProvider>
          <div className="bg-cloudy text-white h-screen flex flex-col">
            <div className="h-[10%]">
              <Navbar role={user.role}/>
            </div>
            <div className={session ? "h-[80%]" : "h-[90%]"}>
              {children}
            </div>
            {session && (
              <div className="h-[10%]">
                <BottomNavbar />
              </div>
            )}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
