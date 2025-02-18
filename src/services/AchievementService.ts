export const AchievementService = (() => {
  const achievementsEndpoint =
    process.env.NEXT_PUBLIC_CANNON_URL + "/achievements";

  const getAchievements = async (): Promise<Achievement[] | null> => {
    const resp = await fetch(`${achievementsEndpoint}`, {
      next: {
        revalidate: 0, // 1 day
      },
    });
    if (resp.ok) return (await resp.json()) as Achievement[];
    return null;
  };

  const getAchievementBySession = async (
    cannonToken: string,
    sessionId: string,
  ): Promise<Achievement | null> => {
    try {
      const resp = await fetch(`${achievementsEndpoint}/session/${sessionId}`, {
        headers: {
          Authorization: `Bearer ${cannonToken}`,
        },
        next: {
          revalidate: 0, // 1 day
        },
      });
      if (resp.ok) return (await resp.json()) as Achievement;
    } catch (e) {
      console.error(e);
    }
    return null;
  };

  const redeemSecretAchievement = async (
    cannonToken: string,
    code: string,
  ): Promise<boolean> => {
    try {
      const resp = await fetch(`${achievementsEndpoint}/redeem/secret`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cannonToken}`,
        },
        body: JSON.stringify({ code }),
      });
      if (resp.ok) return true;
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  const removeUser = async (
    cannonToken: string,
    id: string,
    userId: string,
  ): Promise<Achievement | null> => {
    try {
      const resp = await fetch(
        `${achievementsEndpoint}/${id}/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cannonToken}`,
          },
        },
      );
      if (resp.ok) return (await resp.json()) as Achievement;
    } catch (e) {
      console.error(e);
    }
    return null;
  };

  return {
    getAchievements,
    getAchievementBySession,
    redeemSecretAchievement,
    removeUser,
  };
})();
