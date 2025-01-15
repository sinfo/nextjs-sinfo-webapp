"use client";

import Link from "next/link";

interface BurgerbarItem {
    name: string;
    route: string;
}

interface BurgerbarGroup {
    [key: string]: BurgerbarItem;
}

const burgerbarItems: { [key: string]: BurgerbarGroup } = {
    groupcv: {
        cv: {
            name: "Upload CV",
            route: "/cv"
        },
    },

    groupevents: {
        presentations: {
            name: "Presentations",
            route: "/presentations",
        },
        keynotes: {
            name: "Keynotes",
            route: "/keynotes",
        },
        workshops: {
            name: "Workshops",
            route: "/workshops",
        },
    },

    groupcompanies: {
        companies: {
            name: "Companies",
            route: "/companies"
        },
        connections: {
            name: "Connections",
            route: "/connections",
        },
    },

    groupgeneral: {
        website: {
            name: "Website",
            route: "/website",
        },
        reportbug: {
            name: "Report Bug",
            // Change this route to the correct one (github?)
            route: "/reportbug",
        },
        privacypolicy: {
            name: "Privacy Policy",
            route: "/privacy",
        },
        codeofconduct: {
            name: "Code of Conduct",
            route: "/conduct",
        },
    }
};

export type BurgerbarItemKey = keyof typeof burgerbarItems;

interface BurgerbarIconProps {
    name: BurgerbarItemKey;
}

export default function BurgerItem({ name }: BurgerbarIconProps) {
    const group = burgerbarItems[name];

    return (
        <div className="text-white ml-10 text-lg">
            {Object.values(group).map((item) => (
                <Link key={item.route} href={item.route} className="block py-2">
                    {item.name}
                </Link>
            ))}
        </div>
    );
}