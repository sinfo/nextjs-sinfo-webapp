export const PrizeService = (() => {
  const prizesEndpoint = process.env.NEXT_PUBLIC_CANNON_URL + "/prizes";

  const getPrizes = async (): Promise<Prize[] | null> => {
    try {
      const resp = await fetch(`${prizesEndpoint}`, {
        next: {
          revalidate: 0, // 1 day
        },
      });
      if (resp.ok) return (await resp.json()) as Prize[];
    } catch (e) {
      console.error(e);
    }
    return null;
  };

  return { getPrizes };
})();
