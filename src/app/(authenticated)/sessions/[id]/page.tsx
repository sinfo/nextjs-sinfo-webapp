import { hackyPeeking } from "@/assets/images";
import List from "@/components/List";
import ListCard from "@/components/ListCard";
import MessageCard from "@/components/MessageCard";
import { PrizeTile } from "@/components/prize";
import { SessionService } from "@/services/SessionService";
import { generateTimeInterval } from "@/utils/utils";
import { CalendarClock, MapPin } from "lucide-react";
import Image from "next/image";

interface SessionParams {
  id: string;
}

interface SessionProps {
  params: SessionParams;
}

export default async function Session({ params }: SessionProps) {
  const { id: sessionID } = params;

  const session = await SessionService.getSession(sessionID);

  if (!session) {
    return <div>Session not found</div>;
  }

  return (
    <div className="container m-auto h-full text-black">
      <div className="flex flex-col items-center gap-y-2 p-4 text-center text-sm">
        {session.company && (
          <span className="text-2xl text-gray-500">{session.company.name}</span>
        )}
        <Image
          className="w-40 h-40 object-contain"
          width={150}
          height={150}
          src={session.img || session.company?.img || hackyPeeking}
          alt="Session image."
        />
        <h3 className="text-xl font-bold">{session.name}</h3>
        <div className="flex items-center justify-center gap-x-2 text-sm text-gray-500">
          <span className="flex items-center justify-center gap-x-1">
            <CalendarClock size={16} strokeWidth={1} />
            {generateTimeInterval(session.date, session.duration)}
          </span>
          |
          <span className="flex items-center justify-center gap-x-1">
            <MapPin size={16} strokeWidth={1} />
            {session.place}
          </span>
        </div>
        <span className="bg-sinfo-secondary text-white rounded-md px-3 py-1 font-bold uppercase">
          {session.kind}
        </span>
        <p className="font-light">{session.description}</p>
      </div>
      {/* ExtraInformation */}
      {session.extraInformation?.length && (
        <List title="Information">
          {session.extraInformation.map((e, idx) => (
            <MessageCard key={`info-${idx}`} {...e} />
          ))}
        </List>
      )}
      {/* Speakers */}
      {session.speakers && (
        <List title="Speakers">
          {session.speakers.map((s) => (
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
      {session.company && (
        <List title="Company">
          <ListCard
            title={session.company.name}
            img={session.company.img}
            link={`/companies/${session.company.id}`}
          />
        </List>
      )}
      {/* Prize */}
      {session.prize && (
        <List
          title="Session prize"
          description="Get the opportunity to win this"
        >
          <PrizeTile prize={session.prize} />
        </List>
      )}
    </div>
  );
}
