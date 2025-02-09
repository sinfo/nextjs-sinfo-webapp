export const AchievementService = (() => {
  const achievementsEndpoint =
    process.env.NEXT_PUBLIC_CANNON_URL + "/achievements";

  const getAchievements = async (): Promise<Achievement[] | null> => {
    const resp = await fetch(`${achievementsEndpoint}`, {
      next: {
        revalidate: 86400, // 1 day
      },
    });
    if (resp.ok) return (await resp.json()) as Achievement[];
    return null;
  };

  const getAchievementBySession = async (
    cannonToken: string,
    sessionId: string
  ): Promise<Achievement | null> => {
    try {
      const resp = await fetch(`${achievementsEndpoint}/session/${sessionId}`, {
        headers: {
          Authorization: `Bearer ${cannonToken}`,
        },
        next: { revalidate: 5 },
      });
      if (resp.ok) return (await resp.json()) as Achievement;
    } catch (e) {
      console.error(e);
    }
    return null;
  };

  return { getAchievements, getAchievementBySession };
})();
