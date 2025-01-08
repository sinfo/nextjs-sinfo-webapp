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

  const startDate = new Date(session.date);
  const endDate = new Date(startDate.getTime() + session.duration * 60000);

  const pastSession = new Date() > endDate;

  return (
    <ListCard
      title={session.name}
      subtitle={session.company ? session.company.name : speakersNames}
      img={session.img || session.company?.img || undefined}
      headtext={generateTimeInterval(session.date, session.duration)}
      label={session.kind}
      link={`/sessions/${session.id}`}
      extraClassName={pastSession ? "bg-slate-200 hover:bg-slate-300" : ""}
    />
  );
}
