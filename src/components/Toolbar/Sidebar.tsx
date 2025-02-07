import { ExternalLink, LogOut, X } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";

interface SidebarProps {
  show: boolean;
  onClose: () => void;
}

export default function Sidebar({ show, onClose }: SidebarProps) {
  async function handleLogout() {
    await signOut();
  }

  return (
    <div
      className={`overflow-y-auto z-50 fixed inset-0 bg-sinfo-primary p-10 mb-safe flex flex-col gap-6 transition-transform duration-300 ${
        show ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex justify-end">
        <button onClick={onClose}>
          <X size={40} />
        </button>
      </div>

      {/* Primary Options (grouped) */}
      <div className="flex flex-col gap-10 text-3xl">
        <div className="flex flex-col gap-2">
          <Link href="/profile" onClick={onClose}>
            Profile
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          <Link href="/schedule?kind=keynote" onClick={onClose}>
            Keynotes
          </Link>
          <Link href="/schedule?kind=presentation" onClick={onClose}>
            Presentations
          </Link>
          <Link href="/schedule?kind=workshop" onClick={onClose}>
            Workshops
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          <Link href="/speakers" onClick={onClose}>
            Speakers
          </Link>
          <Link href="/companies" onClick={onClose}>
            Companies
          </Link>
        </div>
        <div></div>
      </div>
      <div className="flex-1" />

      {/* Secondary Options */}
      <div className="flex flex-col gap-2 text-lg">
        <Link
          href="https://sinfo.org/"
          target="_blank"
          className="flex items-center gap-x-2"
        >
          Website
          <ExternalLink size={16} />
        </Link>
        <Link
          href="https://github.com/sinfo/nextjs-sinfo-webapp/issues/new"
          target="_blank"
          className="flex items-center gap-x-2"
        >
          Report a Bug
          <ExternalLink size={16} />
        </Link>
        {/* todo: the pages below dont exist */}
        <Link href="#" onClick={onClose}>
          Privacy Policy
        </Link>
        <Link
          href="https://sinfo.org/code-of-conduct"
          target="_blank"
          className="flex items-center gap-x-2"
        >
          Code of Conduct
          <ExternalLink size={16} />
        </Link>
        <button
          className="flex items-center gap-x-2 text-red-500"
          onClick={handleLogout}
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
}
