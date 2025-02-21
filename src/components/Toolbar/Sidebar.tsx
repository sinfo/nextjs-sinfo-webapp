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
      className={`overflow-y-auto z-50 fixed inset-0 bg-sinfo-primary px-10 py-8 mb-safe flex flex-col gap-6 transition-transform duration-300 ${
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
          <Link href="/profile/connections" onClick={onClose}>
            Connections
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          <Link href="/schedule?kind=keynote&day=today" onClick={onClose}>
            Keynotes
          </Link>
          <Link href="/schedule?kind=presentation&day=today" onClick={onClose}>
            Presentations
          </Link>
          <Link href="/schedule?kind=workshop&day=today" onClick={onClose}>
            Workshops
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          <Link href="/venue" onClick={onClose}>
            Venue
          </Link>
          <Link href="/speakers" onClick={onClose}>
            Speakers
          </Link>
          <Link href="/companies" onClick={onClose}>
            Companies
          </Link>
          <Link href="/prizes" onClick={onClose}>
            Prizes
          </Link>
        </div>
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
          Logout
          <LogOut size={16} />
        </button>
      </div>
    </div>
  );
}
