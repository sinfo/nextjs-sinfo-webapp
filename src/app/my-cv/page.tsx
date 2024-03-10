import Image from "next/image";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import MyCVClient from "./MyCVClient";
import cvIcon from "@/assets/icons/cv.png";
import UserSignOut from "@/components/UserSignOut";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserService } from "@/services/UserService";

export default async function UploadCV() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const user: User = await UserService.getMe(session.cannonToken);
  if (!user) return <UserSignOut />;

  const cvInfo: CVInfo = await UserService.getCVInfo(session.cannonToken);
  const cvDownloadLink = `${process.env.CANNON_URL}/files/me/download?access_token=${session.cannonToken}`;

  const handleCVUpload = async (formData: FormData) => {
    "use server";

    const cv: File | null = formData.get("cv") as unknown as File;
    if (cv == null) return; // TODO: provide feedback to user (e.g. an alert)

    const success = await UserService.uploadCV(session.cannonToken, cv);
    if (!success) return; // TODO: provide feedback to user (e.g. an alert)
  };

  const handleCVDelete = async () => {
    "use server";
    const success = await UserService.deleteCV(session.cannonToken);
    if (!success) return; // TODO: provide feedback to user (e.g. an alert)
  };

  return (
    <div className="w-full h-full flex">
      <div className="w-[90%] sm:w-[400px] m-auto text-center">
        <div className="page-header bg-light-purple">
          <p>My CV</p>
          <Image src={cvIcon} alt="CV Icon" className="w-10" />
        </div>
        <MyCVClient
          cvInfo={cvInfo}
          cvDownloadLink={cvDownloadLink}
          handleCVUpload={handleCVUpload}
          handleCVDelete={handleCVDelete}
        />
      </div>
    </div>
  );
}
