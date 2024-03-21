import type { Metadata } from 'next';
import { SessionsService } from "@/services/SessionsService";

export const metadata: Metadata = {
  title: "Check-in",
};

export default function Checkin() {
  const sessionsData: Promise<any> = SessionsService.getSessions();
  return (
    <div className="h-full flex flex-col items-center">
      <div className="w-72 sm:w-60 h-auto p-4 bg-dark-blue flex justify-between items-center px-16">
        <h1 className="text-2xl font-bold">Check-in</h1>
      </div>    
    </div>
  );
}