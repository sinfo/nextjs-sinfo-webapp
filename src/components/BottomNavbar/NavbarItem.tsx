"use client";

import { Building, Calendar, Home, User, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavbarItemKey = keyof typeof navbarItems;

interface NavbarItemProps {
  name: NavbarItemKey;
  user: User;
}

const navbarItems = {
  home: {
    title: "Home",
    icon: Home,
    route: "/home",
    isSelected: (currPath: string, _: User) => currPath === "/home",
  },
  schedule: {
    title: "Schedule",
    icon: Calendar,
    route: "/schedule?day=today",
    isSelected: (currPath: string, _: User) => currPath === "/schedule",
  },
  profile: {
    title: "Profile",
    icon: User,
    route: "/profile",
    isSelected: (currPath: string, _: User) => currPath === "/profile",
  },
  connections: {
    title: "Connections",
    icon: Users,
    route: "/profile/connections",
    isSelected: (currPath: string, _: User) =>
      currPath === "/profile/connections",
  },
  companies: {
    title: "Companies",
    icon: Building,
    route: "/companies",
    isSelected: (currPath: string, _: User) => currPath === "/companies",
  },
  myCompany: {
    title: "My Company",
    icon: Building,
    route: "/my-company",
    isSelected: (currPath: string, user: User) => {
      if (!user.company || user.company.length <= 0) return false;
      return currPath === `/companies/${user.company[0].company}`;
    },
  },
};

export default function NavbarItem({ name, user }: NavbarItemProps) {
  const { title, icon: Icon, route, isSelected } = navbarItems[name];

  const currPath = usePathname();
  const selected = isSelected(currPath, user);

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
