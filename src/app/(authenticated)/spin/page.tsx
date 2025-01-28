import authOptions from "@/app/api/auth/[...nextauth]/authOptions";
import { CompanyTile } from "@/components/company";
import GridList from "@/components/GridList";
import { UserService } from "@/services/UserService";
import { extractSpinWheelAchievements } from "@/utils/utils";
import { getServerSession } from "next-auth";

const SPIN_WHEEL_MAXIMUM = 10;

export default async function Spin() {
  const session = (await getServerSession(authOptions))!;
  const user: User | null = await UserService.getMe(session.cannonToken);
  if (user === null) return;

  const companies = extractSpinWheelAchievements(user).map(
    (a) => a.achievement.company
  );

  return (
    <div className="container m-auto h-full">
      <div className="flex flex-col gap-y-2 p-4">
        <h1 className="text-2xl font-bold">Spin the Wheel</h1>
        <p className="text-sm text-gray-600">
          1. Visit a company and learn about them. <br />
          2. Ask them to scan your QR code. <br />
          3. After visiting 10 companies, go to the front desk to spin the wheel
          and win prizes!
        </p>
      </div>
      <div className="p-4 pb-0 flex flex-col gap-2">
        <div className="flex flex-row justify-between items-center">
          <span className="font-medium">Companies Visited</span>
          <span>
            {companies.length} / {SPIN_WHEEL_MAXIMUM}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-md h-2">
          <div
            className={`bg-sinfo-tertiary rounded-md h-2`}
            style={{
              width: `${(companies.length / SPIN_WHEEL_MAXIMUM) * 100}%`,
            }}
          />
        </div>
      </div>
      <GridList>
        {companies.length === 0 && <div>No companies found</div>}
        {companies.map((c) => c && <CompanyTile key={c.id} company={c} />)}
      </GridList>
    </div>
  );
}
