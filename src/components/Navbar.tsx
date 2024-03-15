"use client";

import { useState } from 'react';
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Image } from "next/dist/client/image-component";

import "@/styles/navbar.css";


import exitIcon from "@/assets/icons/exit.png";
import menuIcon from "@/assets/icons/menu.png";
import menuIconBlue from "@/assets/icons/menuButtonBlue.png";

import {
  CvDownloadsIcon,
  UploadCvIcon,
  MyLinksIcon,
  AchievementsIcon,
  ReportBugIcon,
  MyCardIcon,
  Workshops,
  AddAchievementsIcon,
  PrivacyPolicyIcon,
  CodeOfConductIcon
} from "@/components/Icons"; // Adjust the import path according to your file structure


type UserRole = 'company' | 'user' | 'team';

type MenuItem = {
  label: string;
  link: string;
  icon?: JSX.Element; // Changed to a function that returns a JSX element
  isExternal?: boolean;
};

type MenuItems = {
  [key in UserRole]: MenuItem[];
};

const menuItems: MenuItems = {
  company: [
    { label: 'CV Downloads', link: '/cv-downloads', icon: <CvDownloadsIcon /> },
    { label: 'Report a Bug', link: '/report-a-bug', icon: <ReportBugIcon /> },
    { label: 'Privacy Policy', link: '/privacy-policy', icon: <PrivacyPolicyIcon /> },
    { label: 'Code of Conduct', link: '/code-of-conduct', icon: <CodeOfConductIcon /> },
  ],
  user: [
    { label: 'Upload CV', link: '/upload-cv', icon: <UploadCvIcon /> },
    { label: 'My Links', link: '/my-links', icon: <MyLinksIcon /> },
    { label: 'Achievements', link: '/achievements', icon: <AchievementsIcon /> },
    { label: 'My Card', link: '/my-card', icon: <MyCardIcon /> },
    { label: 'Report a Bug', link: 'https://github.com/sinfo/nextjs-sinfo-webapp/issues', icon: <ReportBugIcon />, isExternal: true },
    { label: 'Privacy Policy', link: '/privacy-policy', icon: <PrivacyPolicyIcon /> },
    { label: 'Code of Conduct', link: '/code-of-conduct', icon: <CodeOfConductIcon /> },
  ],
  team: [
    { label: 'Upload CV', link: '/upload-cv', icon: <UploadCvIcon /> },
    { label: 'My Links', link: '/my-links', icon: <MyLinksIcon /> },
    { label: 'CV Downloads', link: '/cv-downloads', icon: <CvDownloadsIcon /> },
    { label: 'Workshops', link: '/workshops', icon: <Workshops /> },
    { label: 'Achievements', link: '/achievements', icon: <AchievementsIcon /> },
    { label: 'Add Achievements', link: '/add-achievements', icon: <AddAchievementsIcon /> },
    { label: 'My Card', link: '/my-card', icon: <MyCardIcon /> },
    { label: 'Report a Bug', link: 'https://github.com/sinfo/nextjs-sinfo-webapp/issues', icon: <ReportBugIcon />, isExternal: true },
    { label: 'Privacy Policy', link: '/privacy-policy', icon: <PrivacyPolicyIcon /> },
    { label: 'Code of Conduct', link: '/code-of-conduct', icon: <CodeOfConductIcon /> },
  ],
};

function isValidRole(role: string): role is UserRole {
  const validRoles: UserRole[] = ['company', 'user', 'team'];
  return validRoles.includes(role.toLowerCase() as UserRole); // Make sure role is in the correct case
}


export default function Navbar({ role } : { role: string}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { status } = useSession();
  const router = useRouter();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Use the type guard here
  const userRole: UserRole = isValidRole(role) ? role : 'company'; // Default to 'attendee' or choose appropriately
  console.log(userRole);


  const handleMenuItemClick = (item:any) => {
    if (item.isExternal) {
    // Open the link in a new tab for external URLs
    window.open(item.link, "_blank");
  } else {
    // Use router.push for internal navigation
    router.push(item.link);
  }
  setIsMenuOpen(false); // Close the menu after selection
  };

  async function handleExit() {
    await signOut();
  }

  return (
    <nav className="fullWidthHeightFlex">
      <button className="flexGapPx" onClick={handleExit}>
        Exit
        <Image src={exitIcon} alt="Exit Icon" className="w-6" />
      </button>
      {status === "authenticated" && (
        <>
        <div className="relativeWrapper">
        <button onClick={toggleMenu} className={isMenuOpen ? "buttonSandwich active" : "buttonSandwich"}>
          <Image src={isMenuOpen ? menuIconBlue : menuIcon} alt="Menu Icon" className="w-12" />
        </button>
            {isMenuOpen && (
              <div className="navDropdown">
                {menuItems[userRole].map((item, index) => (
                  <div key={index} className="navDropdownItem" onClick={() => handleMenuItemClick(item)}>
                    {item.icon && <span className="icon">{item.icon}</span>}
                    <span className="label">{item.label}</span>
                  </div>
                ))}
              </div>
            )}
        </div>
        </>
      )}
    </nav>
  );
}
