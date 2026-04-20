import { SpeakerService } from "@/services/SpeakerService";
import SpeakersList from "./SpeakersList";
import BlankPageWithMessage from "@/components/BlankPageMessage";

export default async function Speakers() {
  let speakers = await SpeakerService.getSpeakers();
  const CECILIA_ID = "69e5e2c4868a84c5e45715a1";

  if (!speakers) {
    return <BlankPageWithMessage message="No speakers found!" />;
  }

  // Sort speakers by name
  speakers = speakers
    .filter((s) => s.id !== CECILIA_ID) // filter Cecilia out of the speakers page
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="container mx-auto">
      <SpeakersList speakers={speakers} />
    </div>
  );
}
