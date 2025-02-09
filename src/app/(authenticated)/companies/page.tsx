import { CompanyService } from "@/services/CompanyService";
import CompaniesList from "./CompaniesList";
import BlankPageWithMessage from "@/components/BlankPageMessage";

export default async function Companies() {
  let companies = await CompanyService.getCompanies();

  if (!companies) {
    return <BlankPageWithMessage message="No companies found!" />;
  }

  // Sort companies by name
  companies = companies.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="container mx-auto">
      <CompaniesList companies={companies} />
    </div>
  );
}
