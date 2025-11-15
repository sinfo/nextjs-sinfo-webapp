import Image from "next/image";
import { hackyPeeking } from "@/assets/images";
import Link from "next/link";
import { getServerSession } from "next-auth";
import authOptions from "./api/auth/[...nextauth]/authOptions";
import Toolbar from "@/components/Toolbar";
import BottomNavbar from "@/components/BottomNavbar";

export default async function NotFound() {
  const session = await getServerSession(authOptions);

  return (
    <div
      className={`relative overflow-hidden min-h-screen flex flex-col ${
        session ? "bg-gray-100 text-black" : "bg-white"
      }`}
    >
      {/* Background accents */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-sinfo-primary/10 blur-3xl animate-blob" />
        <div className="absolute top-1/4 -right-10 h-64 w-64 rounded-full bg-sinfo-secondary/10 blur-3xl animate-blob [animation-delay:800ms]" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-sinfo-quaternary/10 blur-3xl animate-blob [animation-delay:1500ms]" />
      </div>

      {session ? <Toolbar /> : null}

      <main className="flex-1 flex items-center justify-center">
        <section className="w-full mx-auto max-w-5xl flex flex-col items-center justify-center gap-4 px-4 py-16 text-center">
        <h1 className="relative text-7xl font-extrabold leading-none tracking-tight sm:text-8xl">
          <span className="text-sinfo-primary">404</span>
          <span className="sr-only">Page not found</span>
        </h1>

        <p className="max-w-xl text-balance text-base text-gray-500 sm:text-lg leading-relaxed">
          Oops, this page got a bit lost.
          <br /> While we are working on it, here&apos;s Hacky peeking to say hi.
        </p>

        {/* Static Hacky placed just above the CTA so it looks like he's holding the button */}
        <div className="relative mx-auto mt-6 -mb-4 flex items-end justify-center">
          <Link href="/" className="cursor-pointer">
            <Image
              src={hackyPeeking}
              alt="Hacky peeking"
              priority
              // keep origin-bottom so any transforms (if later added) pivot from feet
              className="origin-bottom w-48 sm:w-56"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </Link>
        </div>

          <div className="mt-0 flex items-center justify-center gap-3 relative z-10">
            <Link
              href="/"
              className="button-primary text-base font-medium px-10 py-3.5 rounded-full shadow-lg !rounded-full"
            >
              Go back home
            </Link>
          </div>
        </section>
      </main>

      {session ? <BottomNavbar /> : null}
    </div>
  );
}
