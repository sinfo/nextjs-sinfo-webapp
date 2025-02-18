import authOptions from "@/app/api/auth/[...nextauth]/authOptions";
import BlankPageWithMessage from "@/components/BlankPageMessage";
import UserSignOut from "@/components/UserSignOut";
import { UserService } from "@/services/UserService";
import { isCompany } from "@/utils/utils";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function MyCompany() {
  const session = (await getServerSession(authOptions))!;
  const user = await UserService.getMe(session!.cannonToken);
  if (!user) return <UserSignOut />;

  if (!isCompany(user.role)) {
    return (
      <BlankPageWithMessage message="You do not have access to this page." />
    );
  }

  if (!user.company || user.company.length <= 0) {
    return (
      <BlankPageWithMessage message="You are not associated to any company." />
    );
  }

  redirect(`companies/${user.company[0].company}`);
}
