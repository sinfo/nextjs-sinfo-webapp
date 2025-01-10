import { SessionService } from "@/services/SessionService";
import { CompanyService } from "@/services/CompanyService";
import { SpeakerService } from "@/services/SpeakerService";
import { CompanyTile } from "@/components/company";
import { SpeakerTile } from "@/components/speaker";
import { SessionTile } from "@/components/session";
import ListCard from "@/components/ListCard";
import List from "@/components/List";
import GridList from "@/components/GridList";

const N_SESSION_TILES = 3;
const N_COMPANY_TILES = 6;
const N_SPEAKER_TILES = 6;

export default async function Home() {
  const eventSessions = await SessionService.getSessions();
  const companies = await CompanyService.getCompanies();
  const speakers = await SpeakerService.getSpeakers();

  // choose upcoming sessions
  let upcomingSessions: SINFOSession[] = eventSessions
    ? eventSessions
        .filter((s) => new Date(s.date) >= new Date())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, N_SESSION_TILES)
    : [];

  // choose random companies
  let highlightedCompanies: Company[] = companies
    ? companies.sort(() => Math.random() - 0.5).slice(0, N_COMPANY_TILES)
    : [];

  // choose random speakers
  let highlightedSpeakers: Speaker[] = speakers
    ? speakers.sort(() => Math.random() - 0.5).slice(0, N_SPEAKER_TILES)
    : [];

  return (
    <div className="container m-auto h-full text-black">
      {/* Upcoming Sessions */}
      <List title="Next Up" link="/schedule?day=today" linkText="See all">
        {upcomingSessions.length > 0 ? (
          upcomingSessions.map((s) => <SessionTile key={s.id} session={s} />)
        ) : (
          <ListCard title="Nothing to show" />
        )}
      </List>
      {/* Highlighted Companies */}
      <GridList
        title="Companies"
        link="/companies"
        linkText="See all"
        scrollable
      >
        {highlightedCompanies.length > 0 ? (
          highlightedCompanies.map((c) => (
            <CompanyTile key={c.id} company={c} />
          ))
        ) : (
          <ListCard title="Nothing to show" />
        )}
      </GridList>
      {/* Highlighted Speakers */}
      <GridList title="Speakers" link="/speakers" linkText="See all" scrollable>
        {highlightedSpeakers.length > 0 ? (
          highlightedSpeakers.map((s) => <SpeakerTile key={s.id} speaker={s} />)
        ) : (
          <ListCard title="Nothing to show" />
        )}
      </GridList>
    </div>
  );
}
