import QRCode from "react-qr-code";

import Image from "next/image";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";

import hacky from "@/assets/images/hacky-peeking.png";
import UserSignOut from "@/components/UserSignOut";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserService } from "@/services/UserService";
import { CompanyService } from "@/services/CompanyService";
import { getUserColor, getDisplayRole } from "@/utils/UtilityFunctions";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const user: User = await UserService.getMe(session.cannonToken);
  if (!user) return <UserSignOut />;

  let company!: Company | null;
  if (user.role === "company") {
    // assumes that cannon api only provides the company associated with the current edition
    if (user.company.length == 0) {
      await UserService.demoteMe(session.cannonToken);
      redirect("/");
    } else {
      company = await CompanyService.getCompany(user.company[0].company);
    }
  }

  return (
    <div className="h-full flex flex-col items-center">
      <Image className="w-32 sm:w-24" src={hacky} alt="Hacky Peaking" />
      <QRCode
        className="w-72 sm:w-60 h-auto p-4 border-[14px] bg-white rounded-lg"
        style={{ borderColor: getUserColor(user.role) }}
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
