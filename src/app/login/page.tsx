"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { Image } from "next/dist/client/image-component";
import { useRouter } from "next/navigation";

import welcomeImage from "@/assets/images/login-welcome.png";
import webappLogo from "@/assets/images/sinfo-webapp-logo.png";
import googleIcon from "@/assets/icons/google.png";
import istIcon from "@/assets/icons/ist.png";
import linkedinIcon from "@/assets/icons/linkedin.png";
import microsoftIcon from "@/assets/icons/microsoft.png";

export default function Login() {
  const { status } = useSession();
  const { push } = useRouter();

  useEffect(() => {
    if (status === "authenticated") push("/");
  });

  const [loginExpanded, setLoginExpanded] = useState(false);

  return (
    <div className="h-full w-5/6 sm:w-[440px] mx-auto text-center">
      {loginExpanded ? (
        <>
          <Image
            className="pt-[15%] sm:pt-[5%] w-64 mx-auto"
            src={webappLogo}
            alt="SINFO WebApp logo"
            quality={100}
          />
          <h1 className="mt-12 text-4xl font-semibold">Login</h1>
          <div className="flex flex-col items-center mt-12 gap-4">
            <button className="btn-white w-72" onClick={() => signIn("google")}>
              <Image height={25} src={googleIcon} alt="Google Icon" />
              Google
            </button>
            <button className="btn-white w-72" onClick={() => signIn("fenix")}>
              <Image height={25} src={istIcon} alt="IST Icon" />
              Tecnico ID
            </button>
            <button
              className="btn-white w-72"
              onClick={() => signIn("linkedin")}
            >
              <Image height={25} src={linkedinIcon} alt="LinkedIn Icon" />
              LinkedIn
            </button>
            <button
              className="btn-white w-72"
              onClick={() => signIn("microsoft")}
            >
              <Image height={25} src={microsoftIcon} alt="Microsoft Icon" />
              Microsoft
            </button>
          </div>
        </>
      ) : (
        <>
          <Image
            className="pt-[40%] sm:pt-[20%] w-full"
            src={welcomeImage}
            alt="Welcome Image"
            quality={100}
          />
          <button
            className="mt-12 mx-auto btn-white w-48"
            onClick={() => setLoginExpanded(true)}
          >
            Login
          </button>
        </>
      )}
    </div>
  );
}
