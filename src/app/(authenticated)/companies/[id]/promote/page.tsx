import authOptions from "@/app/api/auth/[...nextauth]/authOptions";
import { CompanyService } from "@/services/CompanyService";
import { getServerSession } from "next-auth";
import CompanyPromoteScanner from "./CompanyPromoteScanner";
import BlankPageWithMessage from "@/components/BlankPageMessage";

interface CompanyPromoteParams {
  id: string;
}

export default async function CompanyPromote({
  params,
}: {
  params: CompanyPromoteParams;
}) {
  const { id: companyID } = params;

  const company = await CompanyService.getCompany(companyID);

  if (!company) {
    return <BlankPageWithMessage message="Company not found!" />;
  }

  const session = await getServerSession(authOptions);

  return (
    <div className="container mx-auto flex-1">
      <CompanyPromoteScanner
        company={company}
        cannonToken={session!.cannonToken}
      />
    </div>
  );
}
