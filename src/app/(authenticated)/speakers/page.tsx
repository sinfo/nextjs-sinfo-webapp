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
    <div className="container m-auto h-full gap-y-4 text-black">
      <SpeakersList speakers={speakers} />
    </div>
  );
}
