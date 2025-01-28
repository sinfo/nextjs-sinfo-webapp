import { SessionService } from "@/services/SessionService";
import { CompanyService } from "@/services/CompanyService";
import { SpeakerService } from "@/services/SpeakerService";
import { CompanyTile } from "@/components/company";
import { SpeakerTile } from "@/components/speaker";
import { SessionTile } from "@/components/session";
import ListCard from "@/components/ListCard";
import List from "@/components/List";
import GridList from "@/components/GridList";
import { getServerSession } from "next-auth";
import authOptions from "@/app/api/auth/[...nextauth]/authOptions";
import { UserService } from "@/services/UserService";
import { extractSpinWheelAchievements } from "@/utils/utils";
import Link from "next/link";

const N_SESSION_TILES = 3;
const N_COMPANY_TILES = 6;
const N_SPEAKER_TILES = 6;
const SPIN_WHEEL_MAXIMUM = 10;

export default async function Home() {
  const session = (await getServerSession(authOptions))!;
  const user: User | null = await UserService.getMe(session.cannonToken);
  if (user === null) return;

  const eventSessions = await SessionService.getSessions();
  const companies = await CompanyService.getCompanies();
  const speakers = await SpeakerService.getSpeakers();

  // choose upcoming sessions
  const upcomingSessions: SINFOSession[] = eventSessions
    ? eventSessions
        .filter((s) => new Date(s.date) >= new Date())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, N_SESSION_TILES)
    : [];

  // choose random companies
  const highlightedCompanies: Company[] = companies
    ? companies.sort(() => Math.random() - 0.5).slice(0, N_COMPANY_TILES)
    : [];

  // choose random speakers
  const highlightedSpeakers: Speaker[] = speakers
    ? speakers.sort(() => Math.random() - 0.5).slice(0, N_SPEAKER_TILES)
    : [];

  // stands visited today since last spin the wheel
  const spinWheelProgress = extractSpinWheelAchievements(user).length;

  return (
    <div className="container m-auto h-full">
      {/* Spin the Wheel Section */}
      <div className="p-4 pb-0 flex flex-col gap-2">
        <div className="flex flex-row justify-between items-center">
          <span className="font-medium">Companies Visited</span>
          <span>
            {spinWheelProgress} / {SPIN_WHEEL_MAXIMUM}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-md h-2">
          <div
            className={`bg-sinfo-tertiary rounded-md h-2`}
            style={{
              width: `${(spinWheelProgress / SPIN_WHEEL_MAXIMUM) * 100}%`,
            }}
          />
        </div>
        <div className="text-xs text-gray-600">
          Visit {SPIN_WHEEL_MAXIMUM} companies for a chance to spin the wheel
          and win exciting prizes!&nbsp;
          <Link href={"/spin"} className="text-link">
            See more
          </Link>
        </div>
      </div>
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
