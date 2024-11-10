"use client";

import '../../styles/sidebar.css';
import { useEffect, useState } from 'react';
import { signOut } from "next-auth/react";
import { HiX } from 'react-icons/hi';
import convertToAppRole from "@/utils/utils";
import Link from "next/link";

const sidebarItems = {
    groupcv: {
        cv: {
            name: "Upload CV",
            route: "/cv"
        }
    },

    groupevents: {
        presentations: {
            name: "Presentations",
            route: "/presentations"
        },
        keynotes: {
            name: "Keynotes",
            route: "/keynotes"
        },
        workshops: {
            name: "Workshops",
            route: "/workshops"
        }
    },

    groupcompanies: {
        companies: {
            name: "Companies",
            route: "/companies"
        },
        connections: {
            name: "Connections",
            route: "/connections"
        }
    },

    groupgeneral: {
        website: {
            name: "Website",
            route: "/website"
        },
        reportbug: {
            name: "Report Bug",
            // Change this route to the correct one (github?)
            route: "/reportbug"
        },
        privacypolicy: {
            name: "Privacy Policy",
            route: "/privacy"
        },
        codeofconduct: {
            name: "Code of Conduct",
            route: "/conduct"
        }
    }
};

type sideBarItem = keyof typeof sidebarItems;

const sidebarItemKeysByRole: Record<UserRole, sideBarItem[]> = {
    Attendee: ["groupcv", "groupevents", "groupcompanies", "groupgeneral"],
    Company: ["groupevents", "groupcompanies", "groupgeneral"],
    Member: ["groupcv", "groupevents", "groupcompanies", "groupgeneral"],
    Admin: ["groupcv", "groupevents", "groupcompanies", "groupgeneral"]
};

export default function Sidebar({ onCloseAction, user }: { onCloseAction: () => void, user: User }) {
    const [burgerVisible, setBurgerVisible] = useState(false);
    const [burgerClosing, setBurgerClosing] = useState(false);

    useEffect(() => {
        if (burgerClosing) {
            const timer = setTimeout(() => {
                onCloseAction();
            }, 500);
            return () => clearTimeout(timer);
        } else {
            setBurgerVisible(true);
        }
    }, [burgerClosing, onCloseAction]);

    const handleClose = () => {
        setBurgerClosing(true);
    };

    const handleExit = async () => {
        await signOut();
    };

    return (
        <div className={`sidebar bg-cloudy ${burgerVisible ? 'open' : ''} ${burgerClosing ? 'closing' : ''}`} >
            <HiX className="close-btn" onClick={handleClose}/>
            <div className="sidebar-content">
                {sidebarItemKeysByRole[convertToAppRole(user.role)].map((group) => {
                    const items = sidebarItems[group];
                    return (
                        <div key={group} className={`sidebar-group ${group}`}>
                            {Object.entries(items).map(([key, { name, route }]) => (
                                <Link className="sidebar-link" href={route} key={key}>
                                    {name.toUpperCase()}
                                </Link>
                            ))}
                            {group === "groupgeneral" ? <p className="logout" onClick={handleExit}>{"< LOGOUT"}</p> : null}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}