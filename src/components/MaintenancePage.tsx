import Image from "next/image";
import { sinfoLogo } from "@/assets/images";

export default function MaintenancePage() {
  return (
    <div className="min-h-dvh bg-sinfo-primary flex flex-col items-center justify-center text-white px-6">
      <Image
        className="w-48 mb-8"
        src={sinfoLogo}
        alt="SINFO logo"
        quality={100}
      />
      <h1 className="text-3xl font-bold mb-4 text-center">Under Maintenance</h1>
      <p className="text-lg text-gray-200 text-center max-w-md">
        We&apos;re currently performing some maintenance. Please check back
        soon!
      </p>
    </div>
  );
}
