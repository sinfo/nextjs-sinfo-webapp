import { SocialIcon } from "react-social-icons";

type SocialNetworkType =
  | "linkedin"
  | "linkedinCompany"
  | "email"
  | "github"
  | "website";

interface SocialNetworkProps {
  text: string;
  type: SocialNetworkType;
}

const baseHref: Record<SocialNetworkType, string> = {
  linkedin: "https://linkedin.com/in/",
  linkedinCompany: "https://linkdein.com/company/",
  email: "mailto:",
  github: "https://github.com/",
  website: "",
};

export function SocialNetwork({ text, type }: SocialNetworkProps) {
  const url = `${baseHref[type]}${text}`;
  return <SocialIcon url={url} style={{ height: 32, width: 32 }} />;
}
