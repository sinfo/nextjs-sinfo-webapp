export const EventService = (() => {
  const eventEndpoint = process.env.NEXT_PUBLIC_CANNON_URL + "/event";

  const getLatest = async (): Promise<SINFOEvent | null> => {
    try {
      const resp = await fetch(`${eventEndpoint}/latest`, {
        next: {
          revalidate: 0, // 1 day
        },
      });
      console.log(resp);
      if (resp.ok) return (await resp.json()) as SINFOEvent;
    } catch (e) {
      console.error(e);
    }
    return null;
  };

  return { getLatest };
})();
