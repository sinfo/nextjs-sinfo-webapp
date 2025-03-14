export const SessionService = (() => {
  const sessionsEndpoint = process.env.NEXT_PUBLIC_CANNON_URL + "/session";

  const getSession = async (
    sessionId: string,
  ): Promise<SINFOSession | null> => {
    const resp = await fetch(`${sessionsEndpoint}/${sessionId}`, {
      next: {
        revalidate: 0, // 1 day
      },
    });
    if (resp.ok) return (await resp.json()) as SINFOSession;
    return null;
  };

  const getSessions = async (): Promise<SINFOSession[] | null> => {
    const resp = await fetch(sessionsEndpoint, {
      next: {
        revalidate: 0, // 1 day
      },
    });
    if (resp.ok) return (await resp.json()) as SINFOSession[];
    return null;
  };

  // TODO: Implement this properly
  const checkInUser = async (
    cannonToken: string,
    sessionId: string,
    {
      users = [],
      unregisteredUsers = 0,
    }: { users?: string[]; unregisteredUsers?: number },
  ): Promise<SINFOSessionStatus | null> => {
    try {
      const data = {
        users,
        unregisteredUsers,
      };
      const resp = await fetch(`${sessionsEndpoint}s/${sessionId}/check-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cannonToken}`,
        },
        body: JSON.stringify(data),
      });
      if (resp.ok) {
        // TODO: Revalidate achievements path
        const achievementData = (await resp.json()) as Achievement;
        return {
          status: "success",
          participants: achievementData.users || [],
          unregisteredParticipants: achievementData.unregisteredUsers || 0,
        };
      }
    } catch (error) {
      console.error(error);
    }
    return null;
  };

  return { getSession, getSessions, checkInUser };
})();
