import Image from "next/image";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import QRCode from "react-qr-code";

import hacky from "@/assets/images/hacky-peeking.png";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserService } from "@/services/UserService";
import UserSignOut from "@/components/UserSignOut";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const user = await UserService.getMe(session.cannonToken);

  if (!user) {
    return <UserSignOut />;
  }
  return (
    <div className="flex flex-col items-center">
      <Image width={120} src={hacky} alt="Hacky Peaking" />
      <QRCode
        className={`w-80 h-80 p-5 border-[16px] bg-white rounded-lg`}
        style={{ borderColor: getBorderColor(user.role) }}
        value={user.id}
      />
      <h2 className="mt-5 font-bold text-3xl">{getDisplayRole(user.role)}</h2>
      <h5 className="mt-5 font-medium text-xl">{user.name}</h5>
    </div>
  );
}

const getDisplayRole = (role: string) => {
  switch (role) {
    case "company":
      return "Company";
    case "team":
      return "Member";
    case "admin":
      return "Admin";
    case "user":
    default:
      return "Attendee";
  }
};

const getBorderColor = (role: string) => {
  switch (role) {
    case "team":
    case "admin":
      return "#296CB2";
    case "company":
      return "#B17EC9";
    case "attendee":
    default:
      return "#74C48A";
  }
};
