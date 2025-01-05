import { CompanyService } from '@/services/CompanyService';
import CompaniesList from "./CompaniesList";

export default async function Companies() {
  let companies = await CompanyService.getCompanies();

  if (!companies) {
    return <div>Failed to load companies</div>;
  }

  // Sort companies by name
  companies = companies.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="container m-auto h-full gap-y-4 text-black">
      <CompaniesList companies={companies} />
    </div>
  )
}

