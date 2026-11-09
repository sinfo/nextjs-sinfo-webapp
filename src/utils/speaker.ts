export function enrichSpeakersWithSessions(
  speakers: Speaker[] | null | undefined,
  sessions: SINFOSession[] | null | undefined,
): Speaker[] {
  if (!speakers) return [];
  if (!sessions) return speakers;

  return speakers.map((speaker) => {
    const speakerSessions =
      speaker.sessions && speaker.sessions.length > 0
        ? speaker.sessions
        : sessions.filter((s) =>
            s.speakers?.some((sp) => sp.id === speaker.id),
          );

    return {
      ...speaker,
      sessions: [...speakerSessions].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      ),
    };
  });
}
