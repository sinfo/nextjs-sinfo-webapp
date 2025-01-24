import authOptions from "@/app/api/auth/[...nextauth]/authOptions";
import { hackyPeeking } from "@/assets/images";
import List from "@/components/List";
import ListCard from "@/components/ListCard";
import MessageCard from "@/components/MessageCard";
import { ShowMore } from "@/components/ShowMore";
import { PrizeTile } from "@/components/prize";
import AddToCalendarButton from "@/components/session/AddToCalendarButton";
import { CalendarButton } from "@/components/session/CalendarButton";
import { SessionService } from "@/services/SessionService";
import { UserService } from "@/services/UserService";
import { generateTimeInterval, isMember } from "@/utils/utils";
import { Calendar, CalendarClock, MapPin, Scan, Users } from "lucide-react";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";

interface SessionParams {
  id: string;
}

export default async function Session({ params }: { params: SessionParams }) {
  const { id: sessionID } = params;

  const sinfoSession = await SessionService.getSession(sessionID);

  if (!sinfoSession) {
    return <div>Session not found</div>;
  }

  const session = await getServerSession(authOptions);
  const user: User | null = await UserService.getMe(session!.cannonToken);

  return (
    <div className="container m-auto h-full">
      <div className="flex flex-col items-center gap-y-2 p-4 text-center text-sm">
        {sinfoSession.company && (
          <span className="text-2xl text-gray-600">
            {sinfoSession.company.name}
          </span>
        )}
        <Image
          className="w-40 h-40 object-contain"
          width={150}
          height={150}
          src={sinfoSession.img || sinfoSession.company?.img || hackyPeeking}
          alt="Session image."
        />
        <h3 className="text-xl font-bold">{sinfoSession.name}</h3>
        <div className="flex items-center justify-center gap-x-2 text-sm text-gray-600">
          <span className="flex items-center justify-center gap-x-1">
            <CalendarClock size={16} strokeWidth={1} />
            {generateTimeInterval(sinfoSession.date, sinfoSession.duration)}
          </span>
          |
          <span className="flex items-center justify-center gap-x-1">
            <MapPin size={16} strokeWidth={1} />
            {sinfoSession.place}
          </span>
        </div>
        <span className="bg-sinfo-secondary text-white rounded-md px-3 py-1 font-bold uppercase">
          {sinfoSession.kind}
        </span>
        <ShowMore lines={5} className="font-light">
          {sinfoSession.description}
        </ShowMore>
      </div>
      {/* Members section */}
      {user && isMember(user.role) && (
        <div className="flex justify-center items-center p-4 gap-2">
          <Link
            className="button button-primary text-sm flex-1"
            href={`/sessions/${sessionID}/participants`}
          >
            <Users size={16} />
            Participants
          </Link>
          <Link
            className="button button-primary text-sm flex-1"
            href={`/sessions/${sessionID}/check-in`}
          >
            <Scan size={16} />
            Check-in
          </Link>
        </div>
      )}
      <div className="flex justify-center items-center p-4 gap-2">
        <AddToCalendarButton
          name={`[SINFO 32] - ${sinfoSession.name} (${sinfoSession.kind})`}
          startDate={sinfoSession.date}
          duration={sinfoSession.duration}
          location={sinfoSession.place}
          description={sinfoSession.description}
        />
      </div>
      {/* ExtraInformation */}
      {sinfoSession.extraInformation?.length ? (
        <List title="Information">
          {sinfoSession.extraInformation.map((e, idx) => (
            <MessageCard key={`info-${idx}`} {...e} />
          ))}
        </List>
      ) : (
        <></>
      )}
      {/* Speakers */}
      {sinfoSession.speakers && (
        <List title="Speakers">
          {sinfoSession.speakers.map((s) => (
            <ListCard
              key={s.id}
              title={s.name}
              subtitle={s.title}
              img={s.img}
              link={`/speakers/${s.id}`}
            />
          ))}
        </List>
      )}
      {/* Company */}
      {sinfoSession.company && (
        <List title="Company">
          <ListCard
            title={sinfoSession.company.name}
            img={sinfoSession.company.img}
            link={`/companies/${sinfoSession.company.id}`}
          />
        </List>
      )}
      {/* Prize */}
      {sinfoSession.prize && (
        <List
          title="Session prize"
          description="Get the opportunity to win this"
        >
          <PrizeTile
            prize={sinfoSession.prize}
            participants={sinfoSession.participants || []}
            pickWinner={!!user && isMember(user.role)}
          />
        </List>
      )}
    </div>
  );
}
