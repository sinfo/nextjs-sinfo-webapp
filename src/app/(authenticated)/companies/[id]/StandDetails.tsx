import GridList from "@/components/GridList";
import { Armchair, Construction, Dock } from "lucide-react";

interface StandDetailsProps {
  standDetails: StandDetails;
}

export default function StandDetails({ standDetails }: StandDetailsProps) {
  return (
    <GridList title="Stand details">
      {standDetails ? (
        <>
          <div
            className={`flex flex-col items-center justify-center text-xs ${standDetails.chairs ? "text-sinfo-primary" : "text-gray-300"}`}
          >
            <Armchair size={48} strokeWidth={standDetails.chairs > 0 ? 2 : 1} />
            <span>{standDetails.chairs} Chairs</span>
          </div>
          <div
            className={`flex flex-col items-center justify-center text-xs ${standDetails.table ? "text-sinfo-primary" : "text-gray-300"}`}
          >
            <Dock size={48} strokeWidth={standDetails.table ? 2 : 1} />
            <span>{standDetails.table ? "Want table" : "No table"}</span>
          </div>
          <div
            className={`flex flex-col items-center justify-center text-xs ${standDetails.lettering ? "text-sinfo-primary" : "text-gray-300"}`}
          >
            <Construction
              size={48}
              strokeWidth={standDetails.lettering ? 2 : 1}
            />
            <span>
              {standDetails.lettering ? "Want lettering" : "No lettering"}
            </span>
          </div>
        </>
      ) : (
        <div>Stand details not found</div>
      )}
    </GridList>
  );
}
