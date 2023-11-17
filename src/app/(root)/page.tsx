import QRCode from "react-qr-code";

import Image from "next/image";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { revalidateTag } from "next/cache";

import hacky from "@/assets/images/hacky-peeking.png";
import UserSignOut from "@/components/UserSignOut";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserService } from "@/services/UserService";
import { CompanyService } from "@/services/CompanyService";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const user: User = await UserService.getMe(session.cannonToken);
  if (!user) return <UserSignOut />;

  let company!: Company | null;
  if (user.role === "company") {
    // assumes that cannon api only provides the company associated with the current edition
    if (user.company.length == 0) {
      await demoteMe(session.cannonToken);
    } else {
      company = await CompanyService.getCompany(user.company[0].company);
    }
  }

  return (
    <div className="h-full flex flex-col items-center">
      <Image className="w-32 sm:w-24" src={hacky} alt="Hacky Peaking" />
      <QRCode
        className="w-72 sm:w-60 h-auto p-4 border-[14px] bg-white rounded-lg"
        style={{ borderColor: getBorderColor(user.role) }}
        value={user.id}
      />
      <h2 className="mt-5 font-bold text-3xl">{getDisplayRole(user.role)}</h2>
      {company && (
        <Image
          className="mt-3"
          width={100}
          height={0}
          src={company.img}
          alt={company.name + " Logo"}
        />
      )}
      <h5 className="mt-3 font-medium text-xl">{user.name}</h5>
    </div>
  );
}

const demoteMe = async (cannonToken: string) => {
  const success = await UserService.demoteMe(cannonToken);
  if (success) {
    revalidateTag("modified-me");
    redirect("/");
  }
};

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
