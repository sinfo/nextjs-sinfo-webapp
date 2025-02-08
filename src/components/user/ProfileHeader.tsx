import Image from "next/image";
import { SocialNetwork } from "@/components/SocialNetwork";
import { convertToAppRole, isCompany } from "@/utils/utils";
import { CompanyService } from "@/services/CompanyService";

interface ProfileHeaderProps {
  user: User;
}

export default async function ProfileHeader({ user }: ProfileHeaderProps) {
  const company =
    isCompany(user.role) && user.company?.length
      ? await CompanyService.getCompany(user.company[0].company)
      : undefined;

  return (
    <>
      <header className="bg-sinfo-primary h-[150px] mb-6">
        <Image
          className="size-[150px] object-contain relative left-4 -bottom-8 rounded-full border-white border-4"
          width={150}
          height={150}
          src={user.img}
          alt="User profile picture"
        />
      </header>
      <div className="p-4">
        <span className="text-gray-600 uppercase text-xs">
          {convertToAppRole(user.role)}
          &nbsp;
          {company && `(${company.name})`}
        </span>
        <h5 className="text-lg font-bold">{user.name}</h5>
        {user.title && <p className="text-gray-600">{user.title}</p>}
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
