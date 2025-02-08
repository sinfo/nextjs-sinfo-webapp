import authOptions from "@/app/api/auth/[...nextauth]/authOptions";
import { UserService } from "@/services/UserService";
import { getServerSession } from "next-auth";
import EditProfileForm from "./EditProfileForm";
import { redirect } from "next/navigation";

export default async function EditProfile() {
  const session = (await getServerSession(authOptions))!;
  const user: User | null = await UserService.getMe(session.cannonToken);

  if (!user) {
    return <div>Profile not found</div>;
  }

  async function updateUser(newUser: User) {
    "use server";
    if (await UserService.updateMe(session.cannonToken, newUser)) {
      redirect("/profile");
    }
  }

  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-start gap-y-2 p-4 text-start text-sm">
        <h1 className="text-2xl font-bold">Edit profile</h1>
      </div>

      <EditProfileForm user={user} updateUser={updateUser} />
    </div>
  );
}
