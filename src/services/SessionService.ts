export const SessionService = (() => {
  const sessionsEndpoint = process.env.CANNON_URL + "/session";

  const getSession = async (sessionId: string): Promise<SINFOSession | null> => {
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

  return { getSession, getSessions };
})();
