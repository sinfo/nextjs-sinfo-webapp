import { SpeakerService } from "@/services/SpeakerService";
import SpeakersList from "./SpeakersList";
import BlankPageWithMessage from "@/components/BlankPageMessage";

export default async function Speakers() {
  let speakers = await SpeakerService.getSpeakers();

  if (!speakers) {
    return <BlankPageWithMessage message="No speakers found!" />;
  }

  // Sort speakers by name
  speakers = speakers.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="container mx-auto">
      <SpeakersList speakers={speakers} />
    </div>
  );
}
