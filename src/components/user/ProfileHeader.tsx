import Avatar from "@/components/Avatar";
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
      <header className="relative bg-sinfo-primary h-[150px] mb-6">
        <Avatar
          name={user.name}
          src={user.img}
          alt={`${user.name} profile picture`}
          size={150}
          className="absolute left-4 -bottom-8 border-4 border-white shadow-md"
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
