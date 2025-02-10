import { SocialIcon, SocialIconProps } from "react-social-icons";

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

type SocialNetwork = {
  baseHref: string;
  extraProps?: SocialIconProps;
  transform?(t: string, baseHref: string): string;
};

const socialNetworks: Record<SocialNetworkType, SocialNetwork> = {
  linkedin: { baseHref: "https://linkedin.com/in/" },
  linkedinCompany: { baseHref: "https://linkdein.com/company/" },
  email: { baseHref: "mailto:" },
  github: { baseHref: "https://github.com/" },
  website: {
    baseHref: "",
    transform: (text) => {
      if (!text.startsWith("http")) return `https://${text}`;
      return text;
    },
    extraProps: { bgColor: "#323363" },
  },
};

export function SocialNetwork({ text, type }: SocialNetworkProps) {
  const socialNetwork = socialNetworks[type];
  const url = socialNetwork.transform
    ? socialNetwork.transform(text, socialNetwork.baseHref)
    : `${socialNetwork.baseHref}${text}`;
  return (
    <SocialIcon
      url={url}
      target="_blank"
      style={{ height: 32, width: 32 }}
      {...(socialNetwork.extraProps ?? {})}
    />
  );
}
