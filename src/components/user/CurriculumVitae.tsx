"use client";

import { UserService } from "@/services/UserService";
import { Download, FileUser, Trash, Upload } from "lucide-react";
import { Session } from "next-auth";
import Link from "next/link";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import MessageCard from "../MessageCard";
import { useRouter } from "next/navigation";

interface CurriculumVitaeProps {
  user: User;
  session: Session;
  currentUser?: boolean;
}

export default function CurriculumVitae({
  user,
  session,
  currentUser = false,
}: CurriculumVitaeProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [file, setFile] = useState<SINFOFile | null>(null);
  const [downloadURL, setDownloadURL] = useState<string | null>(null);

  const getCV = useMemo(
    () =>
      async function getCV() {
        const cvInfo = await UserService.getCVInfo(
          session.cannonToken,
          currentUser ? undefined : user.id
        );
        setFile(
          cvInfo && Object.keys(cvInfo).length > 0
            ? (cvInfo as SINFOFile)
            : null
        );
        if (loading) setLoading(false);
      },
    [session.cannonToken, user.id, currentUser, loading]
  );

  const getDownloadURL = useMemo(
    () =>
      async function getDownloadURL() {
        if (file) {
          const url = await UserService.getDownloadURL(
            session.cannonToken,
            currentUser ? undefined : file.id
          );
          setDownloadURL(url);
        } else {
          setDownloadURL(null);
        }
      },
    [session.cannonToken, currentUser, file]
  );

  useEffect(() => {
    getDownloadURL();
  }, [getDownloadURL, file]);

  useEffect(() => {
    getCV();
  }, [getCV, user, session, currentUser]);

  async function handleUploadCV(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.length) return;
    setLoading(true);
    await UserService.uploadCV(session.cannonToken, e.target.files[0]);
    await getCV();
  }

  async function handleDeleteCV() {
    await UserService.deleteCV(session.cannonToken);
    setFile(null);
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center bg-white shadow-md rounded-md animate-pulse p-4 gap-1">
        <div className="h-10 w-full bg-slate-200 rounded-md"></div>
        <div className="h-10 w-full bg-slate-200 rounded-md"></div>
      </div>
    );
  }

  // If there is no file and is not supo
  if (!file && !currentUser) {
    return (
      <div className="flex flex-col justify-center items-center text-center text-gray-600">
        <FileUser size={100} strokeWidth={1} />
        <span>No CV has been uploaded by this user</span>
      </div>
    );
  }

  if (file) {
    return (
      <div className="flex flex-col justify-center items-center gap-y-1 rounded-md text-sm text-sinfo-primary">
        {downloadURL && (
          <Link className="button button-primary w-full" href={downloadURL}>
            <Download size={16} />
            Download
          </Link>
        )}
        {currentUser && (
          <button
            className="button button-primary !bg-red-700 hover:!bg-red-800 w-full"
            onClick={handleDeleteCV}
          >
            <Trash size={16} />
            Delete
          </button>
        )}
        <span className="text-gray-600 text-xs">
          Updated at: {new Date(file.updated).toLocaleString()}
        </span>
      </div>
    );
  }

  return (
    <>
      <MessageCard
        type="info"
        content="By submitting your CV you are accepting the Terms and Conditions. Click to know more."
        onClick={() => router.push("/terms-and-conditions/cv")}
      />
      <div className="relative flex flex-col justify-center items-center text-center p-4 gap-y-2 rounded-md outline-dashed outline-sinfo-primary text-sinfo-primary mt-2">
        <input
          type="file"
          id="cv"
          name="cv"
          accept="application/pdf,.pdf"
          className="absolute top-0 right-0 bottom-0 left-0 opacity-0 cursor-pointer"
          onChange={handleUploadCV}
        />
        <FileUser size={100} strokeWidth={1} />
        <label htmlFor="cv">Upload your CV here</label>
        <div className="button button-primary text-sm w-full">
          <Upload size={16} />
          <span>Upload</span>
        </div>
      </div>
    </>
  );
}
