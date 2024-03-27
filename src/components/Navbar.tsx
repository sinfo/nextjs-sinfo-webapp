"use client";

// Import necessary hooks and components from React, Next.js, and your project
import React from 'react';
import { signOut, useSession } from "next-auth/react"; 
import Image from 'next/image';
import ClientNavbar from "@/components/ClientNavbar"; 

import exitIcon from "@/assets/icons/exit.png";

// Styling for the navbar
import "@/styles/navbar.css"; 

export default function Navbar({ role } : { role: string}) {
  // Use the useSession hook to access the current authentication status
  const { status } = useSession();

  // Function to handle user sign-out
  async function handleExit() {
    // Calls NextAuth's signOut function to terminate the user session
    await signOut(); 
  }

  // Render the navbar
  return (
    <nav className="fullWidthHeightFlex">
      <button className="flexGapPx" onClick={handleExit}>
        Exit
        <Image src={exitIcon} alt="Exit Icon" className="w-6" />
      </button>
      {/* Conditionally render the ClientNavbar if the user is authenticated */}
      {status === "authenticated" && (
        <ClientNavbar role={role}/>
      )}
    </nav>
  );
}
