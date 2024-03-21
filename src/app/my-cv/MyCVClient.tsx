"use client";

import Link from "next/link";
import { useRef } from "react";

interface MyCVClientProps {
  cvInfo: CVInfo;
  cvDownloadLink: string;
  handleCVUpload: (formData: FormData) => Promise<void>;
  handleCVDelete: () => Promise<void>;
}

export default function MyCVClient({
  cvInfo,
  cvDownloadLink,
  handleCVUpload,
  handleCVDelete,
}: MyCVClientProps) {

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const fileFormRef = useRef<HTMLFormElement | null>(null);

  const cvIsPresent = Object.entries(cvInfo).length == 0 ? false : true;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      if (file.type !== "application/pdf") {
        // TODO: provide feedback to user (e.g. an alert)
        return;
      }

      if (file.size > 2097152) {
        // TODO: provide feedback to user (e.g. an alert)
        return;
      }

      fileFormRef.current?.submit();
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mt-4 py-10 px-5 bg-white text-dark-blue text-md font-medium border-4 border-dark-blue rounded-md flex flex-col items-center">
      {/* extension box */}
      <div className="border-2 border-dark-blue rounded-md w-24 h-24 flex items-center justify-center">
        {cvIsPresent ? (
          <p className="text-[#FF0000]">{cvInfo.extension}</p>
        ) : (
          <p>-</p>
        )}
      </div>

      {/* cv filename/download link */}
      {cvIsPresent ? (
        <Link href={cvDownloadLink} target="blank">
          <p className="mt-2 underline">{cvInfo.name}</p>
        </Link>
      ) : (
        <p className="mt-2 text-gray">No CV uploaded yet</p>
      )}

      {/* select/update button */}
      <form action={handleCVUpload} ref={fileFormRef}>
        <input
          name="cv"
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <button className="btn-blue mt-6" onClick={handleFileSelect}>
          {cvIsPresent ? "Update" : "Select File"}
        </button>
      </form>

      {/* delete button */}
      {cvIsPresent && (
        <form action={handleCVDelete}>
          <button type="submit" className="btn-red mt-2">
            Delete
          </button>
        </form>
      )}

      {/* go back button */}
      <Link href="/">
        <button className="btn-blue-outline mt-2">Go Back</button>
      </Link>
    </div>
  );
}
