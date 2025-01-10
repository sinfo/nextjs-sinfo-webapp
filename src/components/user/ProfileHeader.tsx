import Image from "next/image";
import { SocialNetwork } from "@/components/SocialNetwork";
import { convertToAppRole } from "@/utils/utils";

interface ProfileHeaderProps {
  user: User;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <>
      <header className="bg-sinfo-primary h-[150px] mb-6">
        <Image
          className="relative left-4 -bottom-8 rounded-full border-white border-4"
          width={150}
          height={150}
          src={user.img}
          alt="User profile picture"
        />
      </header>
      <div className="p-4">
        <span className="text-gray-500 uppercase text-xs">
          {convertToAppRole(user.role)}
        </span>
        <h5 className="text-lg font-bold">{user.name}</h5>
        {user.title && <p className="text-gray-500">{user.title}</p>}
        {user.contacts && (
          <div className="flex items-center gap-x-2 py-2">
            {user.contacts.email && (
              <SocialNetwork type="email" text={user.contacts.email} />
            )}
            {user.contacts.linkedin && (
              <SocialNetwork type="linkedin" text={user.contacts.linkedin} />
            )}
            {user.contacts.github && (
              <SocialNetwork type="github" text={user.contacts.github} />
            )}
          </div>
        )}
      </div>
    </>
  );
}
