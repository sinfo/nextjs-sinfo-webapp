"use client";

import { useState } from 'react';
import Link from "next/link";
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import React from 'react';

// Importing SVG and PNG icons for the navbar
import menuIcon from "@/assets/icons/menu.png";
import menuIconBlue from "@/assets/icons/menuButtonBlue.png";

import CvDownloadsIcon from "@/assets/icons/cvDownloads.svg"; 
import MyLinksIcon from "@/assets/icons/MyLinks.svg"; 
import UploadCvIcon from "@/assets/icons/cvDownloads.svg"; 
import WorkshopsIcon from "@/assets/icons/Workshops.svg"; 
import AchievementsIcon from "@/assets/icons/Achievements.svg"; 
import AddAchievementsIcon from "@/assets/icons/addAchievements.svg";
import MyCardIcon from "@/assets/icons/myCard.svg"; 
import ReportBugIcon from "@/assets/icons/reportBug.svg"; 
import PrivacyPolicyIcon from "@/assets/icons/privacyPolicy.svg"; 
import CodeOfConductIcon from "@/assets/icons/codeConduct.svg"; 


import "@/styles/navbar.css";

// Mapping icons to their respective component imports
const iconImports = {
  CvDownloadsIcon,
  MyLinksIcon,
  UploadCvIcon,
  AchievementsIcon,
  ReportBugIcon,
  MyCardIcon,
  WorkshopsIcon,
  AddAchievementsIcon,
  PrivacyPolicyIcon,
  CodeOfConductIcon
}; 

// Types for role and menu items
type UserRole = 'company' | 'user' | 'team';
type MenuItem = {
  label: string;
  link: string;
  iconName: string; // Changed to a function that returns a JSX element
  isExternal?: boolean;
};

type MenuItems = {
  [key in UserRole]: MenuItem[];
};

// Defined menu items for different user roles
const menuItems: MenuItems = {
  company: [
    { label: 'CV Downloads', link: '/cv-downloads', iconName: 'CvDownloadsIcon' },
    { label: 'Report a Bug', link: '/report-a-bug', iconName: 'ReportBugIcon' },
    { label: 'Privacy Policy', link: '/privacyPolicy', iconName: 'PrivacyPolicyIcon' },
    { label: 'Code of Conduct', link: '/coc', iconName: 'CodeOfConductIcon' },
  ],
  user: [
    { label: 'Upload CV', link: '/upload-cv', iconName: 'UploadCvIcon' },
    { label: 'My Links', link: '/my-links', iconName: 'MyLinksIcon' },
    { label: 'Achievements', link: '/achievements', iconName: 'AchievementsIcon' },
    { label: 'My Card', link: '/my-card', iconName: 'MyCardIcon' },
    { label: 'Report a Bug', link: 'https://github.com/sinfo/nextjs-sinfo-webapp/issues', iconName: 'ReportBugIcon', isExternal: true },
    { label: 'Privacy Policy', link: '/privacyPolicy', iconName: 'PrivacyPolicyIcon' },
    { label: 'Code of Conduct', link: '/coc', iconName: 'CodeOfConductIcon' },
  ],
  team: [
    { label: 'Upload CV', link: '/upload-cv', iconName: 'UploadCvIcon' },
    { label: 'My Links', link: '/my-links', iconName: 'MyLinksIcon' },
    { label: 'CV Downloads', link: '/cv-downloads', iconName: 'CvDownloadsIcon' },
    { label: 'Workshops', link: '/workshops', iconName: 'WorkshopsIcon' },
    { label: 'Achievements', link: '/achievements', iconName: 'AchievementsIcon' },
    { label: 'Add Achievements', link: '/add-achievements', iconName: 'AddAchievementsIcon' },
    { label: 'My Card', link: '/my-card', iconName: 'MyCardIcon' },
    { label: 'Report a Bug', link: 'https://github.com/sinfo/nextjs-sinfo-webapp/issues', iconName: 'ReportBugIcon', isExternal: true },
    { label: 'Privacy Policy', link: '/privacyPolicy', iconName: 'PrivacyPolicyIcon' },
    { label: 'Code of Conduct', link: '/coc', iconName: 'CodeOfConductIcon' },
  ],
};

// Helper function to validate if a given role is among the defined UserRole types
function isValidRole(role: string): role is UserRole {
  const validRoles: UserRole[] = ['company', 'user', 'team'];
  // Check if the provided role (case-insensitive) is in the array of valid roles
  return validRoles.includes(role.toLowerCase() as UserRole);
}

// The ClientNavbar component
export default function ClientNavbar({ role } : { role: string}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const path = usePathname()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const userRole: UserRole = isValidRole(role) ? role : 'user'; 

  return (
    <>
        <div className="relativeWrapper">
          <button onClick={toggleMenu} className={isMenuOpen ? "buttonSandwich active" : "buttonSandwich"}>
              <Image src={isMenuOpen ? menuIconBlue : menuIcon} alt="Menu Icon" className="w-12" />
          </button>
          {isMenuOpen && (
              <div className="navDropdown">
              {menuItems[userRole].map((item, index) => {
                  const IconComponent = iconImports[item.iconName as keyof typeof iconImports]; // Use type assertion
                  // Directly render Link component for internal links
                  if (!item.isExternal) {
                      return (
                          <Link onClick={toggleMenu} key={`${item.label}-${index}`} href={item.link} passHref>
                              <div className={`navDropdownItem ${path === item.link ? "active" : ""}`}>
                                <div className="icon">
                                  <Image priority src={IconComponent} alt="Icons" width={25} height={25} />
                                </div>
                                  <span className='itemLabel'>{item.label}</span>
                              </div>
                          </Link>
                      );
                  } else {
                      // Handle external links separately
                      return (
                          <a onClick={toggleMenu} key={`${item.label}-${index}`} href={item.link} target="_blank" rel="noopener noreferrer" className="navDropdownItem">
                              <div className="icon">
                                <Image priority src={IconComponent} alt="Icons" width={25} height={25} />
                              </div>
                              <span className='itemLabel'>{item.label}</span>
                          </a>
                      );
                  }
              })}
            </div>
          )}
        </div>
    </>
  );
}