import Image from "next/image";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";

import hacky from "@/assets/images/hacky-peeking.png";
import qrCode from "@/assets/images/qr-code-example.png";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  return (
    <div className="flex flex-col items-center">
      <Image width={120} src={hacky} alt="Hacky Peaking" />
      <Image
        className="w-80 border-[16px] border-blue rounded-lg"
        src={qrCode}
        alt="QR Code"
      />
      <h2 className="mt-5 font-bold text-3xl">Member</h2>
      <h5 className="mt-5 font-medium text-xl">{session.user?.name}</h5>
    </div>
  );
}
