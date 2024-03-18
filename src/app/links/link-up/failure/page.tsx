import Image from "next/image";
import checkIcon from "@/assets/icons/check-in.png";
import Link from "next/link";

export default async function LinkUpFailure() {
  return (
    <div className="w-[90%] sm:w-[400px] mx-auto my-auto py-8 px-5 bg-red flex flex-col items-center">
      {/* Change Icon */}
      <Image
        src={checkIcon}
        alt="Check Icon"
        quality={100}
        width={70}
        height={70}
      />
      <p className="mt-3 text-xl font-semibold text-center">
        Could not create link. Please try again later.
      </p>
      <Link href="/">
        <button className="mt-5 btn-blue">Go Back</button>
      </Link>
    </div>
  );
}
