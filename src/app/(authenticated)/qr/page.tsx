import QRCode from "react-qr-code";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { revalidateTag } from "next/cache";
import { hackyPeeking } from "@/assets/images";
import UserSignOut from "@/components/UserSignOut";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserService } from "@/services/UserService";
import { CompanyService } from "@/services/CompanyService";
import { convertToAppRole } from "@/utils/utils";

export default async function QR() {
  const session = await getServerSession(authOptions);

  const user: User | null = await UserService.getMe(session?.cannonToken ?? "");
  if (!user) return <UserSignOut />;

  let company: Company | null = null;
  if (user.role === "company") {
    // assumes that cannon api only provides the company associated with the current edition
    if (user.company.length == 0) {
      await demoteMe(session!.cannonToken);
    } else {
      company = await CompanyService.getCompany(user.company[0].company);
    }
  }

  // this is undesirable as hex codes are hard to maintain, but the border color sometimes
  // doesn't work if you use tailwind colors like "pink-light" instead
  const borderColor = (() => {
    switch (user.role) {
      case "team":
      case "admin":
        return "#74C48A"; // green-light
      case "company":
        return "#B17EC9"; // pink-light
      case "attendee":
      default:
        return "#296CB2"; // blue
    }
  })();

  return (
    <div className="h-full text-black flex flex-col items-center justify-center">
      <Image className="w-48" src={hackyPeeking} alt="Hacky Peaking" />
      <QRCode
        className="w-72 h-auto p-4 border-[14px] bg-white rounded-lg"
        style={{ borderColor }}
        value={user.id}
      />
      <p className="mt-5 text-2xl text-center px-4">{user.name}</p>
      <p className="mt-2 text-gray-600">{convertToAppRole(user.role)}</p>
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
