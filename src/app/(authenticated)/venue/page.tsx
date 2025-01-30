import { CompanyService } from "@/services/CompanyService";
import VenueStands from "./VenueStands";

export default async function VenuePage() {
  const all_companies = await CompanyService.getCompanies();

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
      })
    )
  ).filter(Boolean);

  if (!companies || companies.length === 0) {
    return companiesNotFetched();
  }

  const uniqueCompanies = Array.from(
    new Map(companies.map((company) => [company?.id, company])).values()
  ).filter((company): company is Company => company !== null); // Remove nulls

  return (
    <div className="container m-auto h-full">
      <div className="flex flex-col items-start gap-y-2 p-4 text-start text-sm">
        <h1 className="text-2xl font-bold">Venue</h1>
      </div>
      <VenueStands companies={uniqueCompanies} />
    </div>
  );
}
