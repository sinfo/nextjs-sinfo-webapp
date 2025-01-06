import ListCard from "@/components/ListCard";
import { generateTimeInterval } from "@/utils/utils";

interface SesionTileProps {
  session: SINFOSession;
}

export function SessionTile({ session }: SesionTileProps) {
  const speakersNames = session.speakers
    ?.map((s) => s.name)
    .sort()
    .join(", ");

  return (
    <ListCard
      title={session.name}
      subtitle={session.company ? session.company.name : speakersNames}
      img={session.img || session.company?.img || undefined}
      headtext={generateTimeInterval(session.date, session.duration)}
      label={session.kind}
      link={`/sessions/${session.id}`}
    />
  );
}
