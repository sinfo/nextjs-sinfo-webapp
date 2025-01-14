export const SessionService = (() => {
  const sessionsEndpoint = process.env.NEXT_PUBLIC_CANNON_URL + "/session";

  const getSession = async (
    sessionId: string,
  ): Promise<SINFOSession | null> => {
    const resp = await fetch(`${sessionsEndpoint}/${sessionId}`, {
      next: {
        revalidate: 86400, // 1 day
      },
    });
    if (resp.ok) return (await resp.json()) as SINFOSession;
    return null;
  };

  const getSessions = async (): Promise<SINFOSession[] | null> => {
    const resp = await fetch(sessionsEndpoint, {
      next: {
        revalidate: 86400, // 1 day
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
      unauthenticatedUsers = 0,
    }: { users?: string[]; unauthenticatedUsers?: number },
  ): Promise<SINFOSessionStatus | null> => {
    try {
      const data = {
        users,
        unauthenticatedUsers,
      };
      const resp = await fetch(`${sessionsEndpoint}/${sessionId}/check-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cannonToken}`,
        },
        body: JSON.stringify(data),
      });
      if (resp.ok) (await resp.json()) as SINFOSessionStatus;
    } catch (error) {
      console.error(error);
    }
    return null;
  };

  return { getSession, getSessions, checkInUser };
})();
