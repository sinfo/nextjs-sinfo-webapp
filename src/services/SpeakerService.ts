export const SpeakerService = (() => {
  const speakersEndpoint = process.env.CANNON_URL + "/speaker";

  const getSpeakers = async (): Promise<Speaker[] | null> => {
    const resp = await fetch(speakersEndpoint, {
      next: {
        revalidate: 86400, // 1 day
      },
    });
    if (resp.ok) {
      const { speakers }: { speakers: Speaker[] } = await resp.json();
      return speakers;
    }
    return null;
  };

  return { getSpeakers };
})();
