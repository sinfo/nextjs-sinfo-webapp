import { FileUser, Users } from "lucide-react";
import Link from "next/link";
import List from "../List";

interface DownloadCVsProps {
  links: DownloadLinks;
}

export default function DownloadCVs({ links }: DownloadCVsProps) {
  return (
    <List title="Download CVs">
      {links.all && (
        <Link className="button-primary text-sm" href={links.all} download>
          <FileUser size={16} />
          Download all
        </Link>
      )}
      {links.companyConnections && (
        <Link
          className="button-tertiary text-sm"
          href={links.companyConnections}
          download
        >
          <Users size={16} />
          Download company connections
        </Link>
      )}
    </List>
  );
}
