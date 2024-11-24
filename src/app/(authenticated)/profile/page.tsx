import Image from "next/image";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";

import UserSignOut from "@/components/UserSignOut";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserService } from "@/services/UserService";

import skyline from '@/assets/images/skyline.png';
import profilePic from '@/assets/images/profile-pic.png';

export default async function Profile() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");
  
    const user: User = await UserService.getMe(session.cannonToken);
    if (!user) return <UserSignOut />;
  
    
  
    return (
        <div className="flex flex-col gap-8 bg-[#F3F4F6] text-black h-full">

            <div className="max-w-md overflow-hidden ">
                {/* Header Image */}
                <div className="relative h-32 w-full">
                    <Image
                    src={skyline}
                    alt="Skyline Background"
                    className="object-cover"
                    fill
                    priority
                    />
                </div>

                {/* Profile Content */}
                <div className="p-6">
                    <div className="flex items-start">
                    {/* Profile Picture */}
                    <div className="relative -mt-12 mr-4">
                        <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-white">
                        <Image
                            src={profilePic}
                            alt="Profile picture"
                            className="object-cover"
                            fill
                            priority
                        />
                        </div>
                    </div>

                    {/* Name and Title */}
                    <div className="mt-1 flex-grow">
                        <h2 className="text-xl font-semibold">Dimitri Vegas</h2>
                        <p className="text-gray-600">CEO @ Google</p>
                    </div>
                    </div>

                    {/* Connect and Menu Buttons */}
                    <div className="mt-6 flex gap-2">
                    <button className="flex-grow rounded bg-[#0A3977] px-4 py-2 text-white hover:bg-[#0A3977]/90 focus:outline-none focus:ring-2 focus:ring-[#0A3977]/50">
                        Connect
                    </button>
                    <button 
                        className="h-10 w-10 rounded border border-[#0A3977] text-[#0A3977] hover:bg-[#0A3977]/10 focus:outline-none focus:ring-2 focus:ring-[#0A3977]/50"
                        aria-label="More options"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-4 w-4 mx-auto">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                        </svg>
                    </button>
                    </div>
                </div>
                </div>
            
            {/*Social Networks*/}
            <div className="mx-4 flex flex-col gap-2">
                <p className="font-bold ">Social Networks</p>
                <div className="flex flex-col gap-3x">
                    {/*Social Networks component*/}
                </div>
            </div>
    
            {/*Achievements*/}
            <div className="mx-4 flex flex-col gap-2">
                <p className="font-bold text-left">Achievements</p>
                <div className="flex flex-col gap-3">
                    {/*Achievements*/}
                </div>
                <button className="text-[#00509A] text-left">See all achievements...</button>
            </div>
    
            {/*Notes*/}
            <div className="mx-4">
                <p className="font-bold ">Notes</p>
                <div>
                    {/*Notes*/}
                </div>
            </div>

        </div>
    );
  }