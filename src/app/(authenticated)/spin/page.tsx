import authOptions from "@/app/api/auth/[...nextauth]/authOptions";
import BlankPageWithMessage from "@/components/BlankPageMessage";
import { CompanyTile } from "@/components/company";
import GridList from "@/components/GridList";
import ProgressBar from "@/components/ProgressBar";
import UserSignOut from "@/components/UserSignOut";
import { CompanyService } from "@/services/CompanyService";
import { UserService } from "@/services/UserService";
import { isCompany, isToday } from "@/utils/utils";
import { getServerSession } from "next-auth";

const SPIN_WHEEL_MAXIMUM = 10;

export default async function Spin() {
  const session = (await getServerSession(authOptions))!;
  const user = await UserService.getMe(session.cannonToken);
  if (!user) return <UserSignOut />;

  if (isCompany(user.role)) {
    return (
      <BlankPageWithMessage message="You're not eligible to spin the wheel." />
    );
  }

  const spinWheelData = user.signatures?.find(
    (s) => s.edition === process.env.EVENT_EDITION && isToday(s.day)
  );

  if (spinWheelData?.redeemed) {
    return (
      <BlankPageWithMessage message="Nice try! You've already used this today. Try again tomorrow!" />
    );
  }

  const allCompanies = (await CompanyService.getCompanies()) ?? [];
  const companyMap = new Map(allCompanies.map((c) => [c.id, c]));

  const spinWheelCompanies =
    spinWheelData?.signatures
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((s) => companyMap.get(s.companyId))
      .filter((c) => c !== undefined) ?? [];

  return (
    <div className="container mx-auto">
      <div className="flex flex-col gap-y-2 p-4">
        <h1 className="text-2xl font-bold">Spin the Wheel</h1>
        <p className="text-sm text-gray-600">
          1. Visit a company and learn about them. <br />
          2. Ask the company to scan your QR code. <br />
          3. After visiting 10 companies, go to the SINFO desk to spin the wheel
          and win prizes!
        </p>
      </div>
      <ProgressBar
        current={spinWheelCompanies.length}
        maximum={SPIN_WHEEL_MAXIMUM}
        title="Companies Visited Today"
        className="pb-2"
      />
      <GridList>
        {spinWheelCompanies.length === 0 && <div>No companies to show</div>}
        {spinWheelCompanies.map(
          (c) => c && <CompanyTile key={c.id} company={c} />
        )}
      </GridList>
    </div>
  );
}
