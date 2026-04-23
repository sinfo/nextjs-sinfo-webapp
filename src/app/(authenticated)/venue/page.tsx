import { CompanyService } from "@/services/CompanyService";
import { SpeakerService } from "@/services/SpeakerService";
import { SessionService } from "@/services/SessionService";
import VenueViewer from "@/components/Venue/VenueViewer";
import { getServerSession } from "next-auth";
import authOptions from "@/app/api/auth/[...nextauth]/authOptions";
import { UserService } from "@/services/UserService";

export default async function VenuePage() {
  const all_companies = await CompanyService.getCompanies();
  const session = await getServerSession(authOptions);
  const user = session?.cannonToken
    ? await UserService.getMe(session.cannonToken)
    : null;

  function companiesNotFetched() {
    return (
      <div className="container m-auto h-full p-4">
        <div className="text-center">No companies found!</div>
      </div>
    );
  }

  if (!all_companies || all_companies.length === 0) {
    return companiesNotFetched();
  }

  const companies = (
    await Promise.all(
      all_companies.map(async (company) => {
        const detailedCompany = await CompanyService.getCompany(company.id);
        return detailedCompany;
      }),
    )
  ).filter(Boolean);

  if (!companies || companies.length === 0) {
    return companiesNotFetched();
  }

  const uniqueCompanies = Array.from(
    new Map(companies.map((company) => [company?.id, company])).values(),
  ).filter((company): company is Company => company !== null);

  const speakers = (await SpeakerService.getSpeakers()) ?? [];
  const sessions = (await SessionService.getSessions()) ?? [];

  return (
    <div className="container m-auto h-full">
      <div className="flex flex-col items-start gap-y-2 p-4 text-start text-sm">
        <h1 className="text-2xl font-bold">Venue</h1>
      </div>

      <VenueViewer
        companies={uniqueCompanies}
        speakers={speakers}
        sessions={sessions}
        userRole={user?.role}
      />
    </div>
  );
}
