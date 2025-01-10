"use client";

import { Building, Calendar, Home, User, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavbarItemKey = keyof typeof navbarItems;

interface NavbarIconProps {
  name: NavbarItemKey;
}

const navbarItems = {
  home: {
    title: "Home",
    icon: Home,
    route: "/home",
  },
  schedule: {
    title: "Schedule",
    icon: Calendar,
    route: "/schedule",
  },
  profile: {
    title: "Profile",
    icon: User,
    route: "/profile",
  },
  connections: {
    title: "Connections",
    icon: Users,
    route: "/profile/connections",
  },
  companies: {
    title: "Companies",
    icon: Building,
    route: "/companies",
  },
};

export default function NavbarItem({ name }: NavbarIconProps) {
  const { title, icon: Icon, route } = navbarItems[name];

  const currPath = usePathname();
  const selected = route === currPath;

  return (
    <Link
      key={`path-${name}`}
      href={route}
      className={`flex-1 flex flex-col items-center justify-center py-2 text-center border-b-4 ${selected ? "border-white text-white" : "border-transparent border-gray-300 text-gray-300"}`}
    >
      <Icon size={24} strokeWidth={selected ? 2 : 1} />
      <span className="text-xs">{title}</span>
    </Link>
  );
}
