import { SessionService } from "@/services/SessionService";
import { CompanyService } from "@/services/CompanyService";
import { SpeakerService } from "@/services/SpeakerService";
import { CompanyTile } from "@/components/company";
import { SpeakerTile } from "@/components/speaker";
import { SessionTile } from "@/components/session";
import ListCard from "@/components/ListCard";
import List from "@/components/List";
import GridList from "@/components/GridList";
import ProgressBar from "@/components/ProgressBar";
import Link from "next/link";
import { getServerSession } from "next-auth";
import authOptions from "@/app/api/auth/[...nextauth]/authOptions";
import { UserService } from "@/services/UserService";
import { getUserActiveSignatureData, isAttendee } from "@/utils/utils";
import UserSignOut from "@/components/UserSignOut";
import { SPIN_WHEEL_MAXIMUM } from "@/constants";
import { EventService } from "@/services/EventService";

const N_SESSION_TILES = 3;
const N_COMPANY_TILES = 15;
const N_SPEAKER_TILES = 10;

export default async function Home() {
  const session = (await getServerSession(authOptions))!;
  const user = await UserService.getMe(session.cannonToken);
  if (!user) return <UserSignOut />;

  const event = await EventService.getLatest();
  const eventSessions = await SessionService.getSessions();
  const companies = await CompanyService.getCompanies();
  const speakers = await SpeakerService.getSpeakers();

  // choose upcoming or random sessions
  const tenMinutesEarlier = new Date(new Date().getTime() - 10 * 60 * 1000);
  const upcomingSessions: SINFOSession[] = eventSessions
    ? eventSessions
        .filter((s) => new Date(s.date) >= tenMinutesEarlier)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, N_SESSION_TILES)
    : [];
  const highlightedSessions =
    upcomingSessions.length > 0
      ? upcomingSessions
      : (eventSessions
          ?.sort(() => Math.random() - 0.5)
          .slice(0, N_SESSION_TILES) ?? []);

  // choose random companies
  const highlightedCompanies: Company[] = companies
    ? companies.sort(() => Math.random() - 0.5).slice(0, N_COMPANY_TILES)
    : [];

  // choose random speakers
  const highlightedSpeakers: Speaker[] = speakers
    ? speakers.sort(() => Math.random() - 0.5).slice(0, N_SPEAKER_TILES)
    : [];

  let standDates = new Set(
    companies?.flatMap(
      (c) => c.stands?.flatMap((cs) => cs.date.slice(0, 10)) ?? []
    ) ?? []
  );
  let today = new Date().toISOString().split("T")[0];
  const spinWheelData = getUserActiveSignatureData(user, event?.id ?? ``);
  const showSpinWheelSection =
    standDates.has(today) && isAttendee(user.role) && !spinWheelData?.redeemed;

  return (
    <div className="container mx-auto">
      {/* Spin the Wheel Section */}
      {showSpinWheelSection && (
        <ProgressBar
          current={Math.min(
            spinWheelData?.signatures.length ?? 0,
            SPIN_WHEEL_MAXIMUM
          )}
          maximum={SPIN_WHEEL_MAXIMUM}
          title="Companies Visited Today"
          className="pb-2"
        >
          <div className="text-xs text-gray-600">
            Visit {SPIN_WHEEL_MAXIMUM} companies for a chance to spin the wheel
            and win exciting prizes!&nbsp;
            <Link href={"/spin"} className="text-link">
              See more
            </Link>
          </div>
        </ProgressBar>
      )}

      {/* Upcoming Sessions */}
      <List
        title={upcomingSessions.length > 0 ? "Next Up" : "Sessions"}
        link="/schedule?day=today"
        linkText="See all"
      >
        {highlightedSessions.length > 0 ? (
          highlightedSessions.map((s) => (
            <SessionTile key={s.id} session={s} indicatePastSession={false} />
          ))
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
