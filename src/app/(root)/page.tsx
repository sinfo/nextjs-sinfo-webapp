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
  if (!user) return <UserSignOut />;

  return (
    <div className="h-full flex flex-col items-center">
      <Image className="w-32 sm:w-24" src={hacky} alt="Hacky Peaking" />
      <QRCode
        className="w-72 sm:w-64 h-72 sm:h-64 p-4 border-[14px] bg-white rounded-lg"
        style={{ borderColor: getBorderColor(user.role) }}
        value={user.id}
      />
      <h2 className="mt-5 font-bold text-3xl">{getDisplayRole(user.role)}</h2>
      <h5 className="mt-5 font-medium text-xl">{user.name}</h5>
    </div>
  );
}

const getBorderColor = (role: string) => {
  switch (role) {
    case "team":
    case "admin":
      return "#296CB2"; // blue
    case "company":
      return "#B17EC9"; // pink
    case "attendee":
    default:
      return "#74C48A"; // green
  }
};

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
