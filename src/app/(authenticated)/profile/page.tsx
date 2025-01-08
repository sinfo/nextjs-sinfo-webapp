import authOptions from "@/app/api/auth/[...nextauth]/authOptions";
import List from "@/components/List";
import ListCard from "@/components/ListCard";
import ProfileHeader from "@/components/user/ProfileHeader";
import { UserService } from "@/services/UserService";
import { University, UserPen } from "lucide-react";
import { getServerSession } from "next-auth";

export default async function Profile() {
  const session = await getServerSession(authOptions);
  const user: User | null = await UserService.getMe(session!.cannonToken);

  if (!user) {
    return <div>Profile not found</div>;
  }

  return (
    <div className="container m-auto h-full text-black">
      <ProfileHeader user={user} />
      <button className="button-primary text-sm font-bold uppercase w-full mt-2">
        <UserPen size={16} />
        Edit profile
      </button>
      <List title="Academic Information">
        <ListCard
          title="Computer Science and Engineering"
          subtitle="Instituto Superior Técnico"
          headtext="Master degree"
          label="GPA 16.7"
        />
      </List>
    </div>
  );
}
