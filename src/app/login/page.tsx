"use client";

import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { Image } from "next/dist/client/image-component";
import { useRouter } from "next/navigation";
import {
  googleIcon,
  istIcon,
  linkedinIcon,
  microsoftIcon,
} from "@/assets/icons";
import { sinfoLogo } from "@/assets/images";
import AuthProviderButton from "./AuthProviderButton";

export default function Login() {
  const { status } = useSession();
  const { push } = useRouter();

  useEffect(() => {
    if (status === "authenticated") push("/");
  });

  return (
    <div className="h-screen bg-sinfo-primary flex flex-col">
      <Image
        className="w-48 mx-auto pt-8"
        src={sinfoLogo}
        alt="SINFO logo"
        quality={100}
      />
      <div className="flex flex-col items-center justify-center gap-5 flex-1">
        <AuthProviderButton
          icon={googleIcon}
          name="Google"
          onClick={() => signIn("google")}
        />
        <AuthProviderButton
          icon={linkedinIcon}
          name="LinkedIn"
          onClick={() => signIn("linkedin")}
        />
        <AuthProviderButton
          icon={microsoftIcon}
          name="Microsoft"
          onClick={() => signIn("microsoft")}
        />
        <AuthProviderButton
          icon={istIcon}
          name="Técnico ID"
          onClick={() => signIn("fenix")}
        />
      </div>
      <p className="text-center text-gray-300 pb-3">SINFO - Website</p>
    </div>
  );
}
