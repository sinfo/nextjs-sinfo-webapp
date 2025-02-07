import { SpeakerService } from "@/services/SpeakerService";
import SpeakersList from "./SpeakersList";

export default async function Speakers() {
  let speakers = await SpeakerService.getSpeakers();

  if (!speakers) {
    return <div>Failed to load speakers</div>;
  }

  // Sort speakers by name
  speakers = speakers.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="container mx-auto">
      <SpeakersList speakers={speakers} />
    </div>
  );
}
