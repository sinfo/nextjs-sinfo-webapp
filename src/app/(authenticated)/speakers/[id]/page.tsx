import BlankPageWithMessage from "@/components/BlankPageMessage";
import List from "@/components/List";
import { ShowMore } from "@/components/ShowMore";
import { SessionTile } from "@/components/session";
import { SpeakerService } from "@/services/SpeakerService";
import Image from "next/image";

interface SpeakerParams {
  id: string;
}

export default async function Speaker({ params }: { params: SpeakerParams }) {
  const { id: speakerID } = params;

  const speaker = await SpeakerService.getSpeaker(speakerID);

  if (!speaker) {
    return <BlankPageWithMessage message="Speaker not found!" />;
  }

  const speakerSessions = speaker.sessions?.sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center gap-y-2 p-4 text-center">
        <h2 className="text-2xl font-bold">{speaker.name}</h2>
        <Image
          className="w-40 h-40 object-contain"
          width={150}
          height={150}
          src={speaker.img}
          alt={`${speaker.name} logo`}
        />
        <h4>{speaker.title}</h4>
        {speaker.company?.img && (
          <Image
            className="h-16 w-16 object-contain"
            width={64}
            height={64}
            src={speaker.company.img}
            alt={`${speaker.company.name} logo`}
          />
        )}
        <ShowMore lines={5} className="text-sm font-light">
          {speaker.description}
        </ShowMore>
      </div>
      {/* Company Sessions */}
      {speakerSessions?.length ? (
        <List title="Sessions">
          {speakerSessions.map((s) => (
            <SessionTile key={s.id} session={s} />
          ))}
        </List>
      ) : (
        <></>
      )}
    </div>
  );
}
