export const SpeakerService = (() => {
  const speakersEndpoint = process.env.NEXT_PUBLIC_CANNON_URL + "/speaker";

  const getSpeaker = async (id: string): Promise<Speaker | null> => {
    const resp = await fetch(`${speakersEndpoint}/${id}`, {
      next: {
        revalidate: 0, // 1 day
      },
    });
    if (resp.ok) return (await resp.json()) as Speaker;
    return null;
  };

  const getSpeakers = async (): Promise<Speaker[] | null> => {
    const resp = await fetch(speakersEndpoint, {
      next: {
        revalidate: 0, // 1 day
      },
    });
    if (resp.ok) {
      const { speakers }: { speakers: Speaker[] } = await resp.json();
      return speakers;
    }
    return null;
  };

  return { getSpeaker, getSpeakers };
})();
