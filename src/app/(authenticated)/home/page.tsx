import Link from "next/link";
import { SessionService } from "@/services/SessionService";
import { CompanyService } from "@/services/CompanyService";
import { SpeakerService } from "@/services/SpeakerService";
import { CompanyTile } from "@/components/company";
import { SpeakerTile } from "@/components/speaker";
import { SessionTile } from "@/components/session";
import { generateTimeInterval } from "@/utils/utils";

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
    <div className="h-full px-5 py-4 space-y-4 text-black">
      {/* Upcoming Sessions */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold">Next Up</span>
          <Link href="/sessions" className="text-blue">
            See all
          </Link>
        </div>
        {upcomingSessions.length > 0 ? (
          <div className="flex flex-col gap-2">
            {upcomingSessions.map((s) => (
              <SessionTile
                img={s.img}
                title={s.name}
                time={generateTimeInterval(s.date, s.duration)}
                presenter={s.presenters.length > 0 ? s.presenters[0] : null}
                type={s.kind}
              />
            ))}
          </div>
        ) : (
          <div className="text-gray-500">Nothing to show</div>
        )}
      </div>
      {/* Highlighted Companies */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold">Companies</span>
          <Link href="/companies" className="text-blue">
            See all
          </Link>
        </div>
        {highlightedCompanies.length > 0 ? (
          <div className="w-full overflow-x-auto">
            <div className="inline-flex space-x-2">
              {highlightedCompanies.map((c) => (
                <CompanyTile
                  name={c.name}
                  img={c.img}
                  // TODO(anees): set hereToday for companies present today
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-gray-500 text-sm">Nothing to show</div>
        )}
      </div>
      {/* Highlighted Speakers */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold">Speakers</span>
          <Link href="/speakers" className="text-blue">
            See all
          </Link>
        </div>
        {highlightedSpeakers.length > 0 ? (
          <div className="w-full overflow-x-auto">
            <div className="inline-flex space-x-2">
              {highlightedSpeakers.map((s) => (
                <SpeakerTile
                  name={s.name}
                  img={s.img}
                  companyImg={s.companyImg}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-gray-500 text-sm">Nothing to show</div>
        )}
      </div>
    </div>
  );
}
