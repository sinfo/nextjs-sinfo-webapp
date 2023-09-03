import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";

export default async function Home() {
  const session = await getServerSession();

  if (!session) redirect("/login");

  return (
    <div className="flex justify-center pt-16 text-2xl font-bold">
      Welcome {session?.user?.name}
    </div>
  );
}
