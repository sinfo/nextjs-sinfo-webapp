import QRCode from "react-qr-code";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { revalidateTag } from "next/cache";
import UserSignOut from "@/components/UserSignOut";
import authOptions from "@/app/api/auth/[...nextauth]/authOptions";
import { UserService } from "@/services/UserService";
import { CompanyService } from "@/services/CompanyService";
import { convertToAppRole, isCompany } from "@/utils/utils";
import Link from "next/link";
import { ScanQrCode } from "lucide-react";
import BlankPageWithMessage from "@/components/BlankPageMessage";
import History from "./History";

export default async function QR() {
  const session = await getServerSession(authOptions);

  const user: User | null = await UserService.getMe(session?.cannonToken ?? "");
  if (!user) return <UserSignOut />;

  const userQRCode: string | null = await UserService.getQRCode(
    session!.cannonToken
  );
  if (!userQRCode)
    return <BlankPageWithMessage message="Unable to get QR code." />;

  let company: Company | null = null;
  if (isCompany(user.role)) {
    // assumes that cannon api only provides the company associated with the current edition
    if (user.company && user.company.length > 0) {
      company = await CompanyService.getCompany(user.company[0].company);
    } else {
      await demoteMe(session!.cannonToken);
    }
  }

  // this is undesirable as hex codes are hard to maintain, but the border color sometimes
  // doesn't work if you use tailwind colors like "pink-light" instead
  const borderColor = (() => {
    switch (convertToAppRole(user.role)) {
      case "Member":
      case "Admin":
        return "#A73939"; // SINFO Secondary
      case "Company":
        return "#DB836E"; // SINFO Tertiary
      case "Attendee":
      default:
        return "#323363"; // SINFO Primary
    }
  })();

  return (
    <div className="container mx-auto flex flex-col">
      <div className="flex flex-col h-full justify-center items-center text-center p-4 py-8 gap-y-4">
        <div className="flex flex-col justify-center items-center">
          <QRCode
            className="w-72 h-72 p-4 border-[14px] bg-white rounded-lg"
            style={{ borderColor }}
            value={userQRCode}
          />
        </div>
        <div>
          <p className="text-2xl text-center">{user.name}</p>
          <p className="text-gray-600 uppercase">
            {convertToAppRole(user.role)}
          </p>
        </div>
        <Link
          href="/qr/scan"
          className="button button-primary text-lg w-full"
          style={{ backgroundColor: borderColor }}
        >
          <ScanQrCode size={24} />
          Scan
        </Link>
        {company && (
          <Link href={`/companies/${company.id}`}>
            <Image
              className="size-[50px] object-contain"
              width={50}
              height={50}
              src={company.img}
              alt={`${company.name} logo`}
            />
          </Link>
        )}
      </div>
      <History />
    </div>
  );
}

const demoteMe = async (cannonToken: string) => {
  const success = await UserService.demoteMe(cannonToken);
  if (success) {
    revalidateTag("modified-me");
    redirect("/");
  }
  return null;
};
