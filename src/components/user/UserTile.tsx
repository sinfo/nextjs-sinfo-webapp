import Avatar from "@/components/Avatar";
import Link from "next/link";

interface UserTileProps {
  user: User;
}

export function UserTile({ user }: UserTileProps) {
  return (
    <Link href={`/users/${user.id}`} className="grow">
      <div className="min-w-[300px] min-h-[74px] px-4 py-2 flex items-center justify-start gap-x-4 bg-white rounded-md shadow-md text-sm overflow-hidden hover:bg-slate-50 hover:shadow-sm active:bg-gray-200 active:shadow-none">
        <Avatar
          name={user.name}
          src={user.img}
          alt={`${user.name} picture`}
          size={40}
        />
        <div className="flex flex-col justify-start min-w-0">
          <span className="truncate" title={user.name}>
            {user.name}
          </span>
          {user.title && (
            <span className="text-xs truncate" title={user.title}>
              {user.title}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
