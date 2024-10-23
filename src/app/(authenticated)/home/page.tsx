import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="h-full flex flex-col">
      {session?.user?.name && (
        <p className="pl-5 pt-2 pb-4 font-medium text-lg tracking-wide">
          Welcome, {session.user.name}!
        </p>
      )}
      <div className="flex-1 bg-gray-200">
        {/* page content goes here */}
      </div>
    </div>
  );
}
