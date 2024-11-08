"use client";

import { useState } from 'react';
import Toolbar from "@/components/Topbar/Toolbar";
import Sidebar from "@/components/Topbar/Sidebar";


export default function Topbar() {
    const [toggleBurger, setToggleBurger] = useState(false);

    const toggleBurgerMenu = () => {
        setToggleBurger(!toggleBurger);
    }

    return (
        <div>
            <Toolbar toggleBurgerMenu={toggleBurgerMenu} />
            {toggleBurger && <Sidebar onCloseAction={toggleBurgerMenu}/>}
        </div>
    );
}