import Image from "next/image";
import checkIcon from "@/assets/icons/check-in.png";
import Link from "next/link";

export default async function LinkUpSuccess() {
  return (
    <div className="w-[90%] sm:w-[400px] mx-auto my-auto py-8 px-5 rounded-md bg-greenAC flex flex-col items-center">
      <Image
        src={checkIcon}
        alt="Check Icon"
        quality={100}
        width={70}
        height={70}
      />
      <p className="mt-5 text-xl font-semibold text-center">
        Link created successfully!
      </p>
      <Link href="/links/my-links">
        <button className="mt-5 btn-blue">My Links</button>
      </Link>
      <Link href="/">
        <button className="mt-2 btn-blue-outline">Go Back</button>
      </Link>
    </div>
  );
}
