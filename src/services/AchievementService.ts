export const AchievementService = (() => {
  const achievementsEndpoint = process.env.CANNON_URL + "/achievements";

  const getAchievements = async (): Promise<Achievement[] | null> => {
    const resp = await fetch(`${achievementsEndpoint}`, {
      next: {
        revalidate: 86400, // 1 day
      },
    });
    if (resp.ok) return (await resp.json()) as Achievement[];
    return null;
  };

  return { getAchievements };
})();
