"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

import linkIcon from "@/assets/icons/link.png";
import linkColorIcon from "@/assets/icons/link-color.png";
import { getUserColor, getDisplayRole } from "@/utils/UtilityFunctions";

interface LinkUpClientProps {
  user: User;
  scannedUser: User;
  company: Company;
  handleCreateLink: (formData: FormData) => Promise<void>;
}

export default function LinkUpClient({
  user,
  scannedUser,
  company,
  handleCreateLink,
}: LinkUpClientProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const connectionForm = (
    <div className="mt-5 border-4 border-dark-blue bg-dark-blue rounded-md text-left">
      {/* form header */}
      <div className="px-5 py-3 flex justify-between items-center">
        <div className="max-w-[70%]">
          <p className="text-xl font-semibold">
            {scannedUser.role === "company"
              ? company.name
              : getDisplayRole(scannedUser.role)}
          </p>
          <p className="mt-1">{scannedUser.name}</p>
        </div>
        <Image
          className="rounded-full"
          src={scannedUser.img}
          alt="Scanned User Image"
          width={70}
          height={0}
        />
      </div>

      {/* form body */}
      <form
        action={handleCreateLink}
        className="bg-white text-dark-blue p-5 font-medium flex flex-col gap-2"
      >
        <div>
          <p>Notes</p>
          <textarea
            rows={6}
            name="notes"
            className="w-full p-2 border-2 rounded-md border-dark-blue"
            placeholder="Have something to write down?"
          />
        </div>
        <button type="submit" className="btn-blue mt-2 mx-auto">
          Create Link
        </button>
      </form>
    </div>
  );

  const connectionPreview = (
    <div className="mt-5 py-8 bg-white text-dark-blue text-md font-medium border-4 border-dark-blue rounded-md flex flex-col items-center">
      {/* profiles Section */}
      <div className="flex justify-between w-[90%]">
        {/* user profile */}
        <div className="w-[45%] flex flex-col items-center">
          <Image
            className="rounded-full border-4"
            style={{ borderColor: getUserColor(user.role) }}
            src={user.img}
            alt="User 1 Image"
            quality={100}
            width={110}
            height={110}
          />
          <p className="text-center mt-5 mb-2">{user.name}</p>
          {user.role === "company" && company && (
            <Image
              width={80}
              height={0}
              src={company.img}
              alt={company.name + " Logo"}
            />
          )}
        </div>

        {/* link icon between profiles */}
        <Image
          src={linkColorIcon}
          alt="Link Color Icon"
          className="mt-10 w-[10%] h-8"
        />

        {/* scanned user profile */}
        <div className="w-[45%] flex flex-col items-center">
          <Image
            className="rounded-full border-4"
            style={{ borderColor: getUserColor(scannedUser.role) }}
            src={scannedUser.img}
            alt="Person 2 Image"
            quality={100}
            width={110}
            height={110}
          />
          <p className="text-center mt-5 mb-2">{scannedUser.name}</p>
          {scannedUser.role === "company" && company && (
            <Image
              width={80}
              height={0}
              src={company.img}
              alt={company.name + " Logo"}
            />
          )}
        </div>
      </div>

      {/* continue button */}
      <button className="btn-blue mt-8" onClick={() => setIsFormOpen(true)}>
        Continue
      </button>

      {/* rescan button */}
      {/* TODO: redirect to qr code scanner when its done */}
      <button className="btn-blue-outline mt-2">Rescan</button>
    </div>
  );

  return (
    <div className="w-[90%] sm:w-[400px] m-auto text-center">
      <div className="page-header bg-light-blue">
        <p>Link Up</p>
        <Image src={linkIcon} alt="Link Icon" className="w-10" />
      </div>
      {isFormOpen ? (
        <>
          {connectionForm}
          <button
            className="btn-blue mt-8"
            onClick={() => setIsFormOpen(false)}
          >
            Go back
          </button>
        </>
      ) : (
        <>
          {connectionPreview}
          <Link href="/">
            <button className="btn-blue mt-8">Go Back</button>
          </Link>
        </>
      )}
    </div>
  );
}
