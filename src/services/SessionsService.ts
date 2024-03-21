export const SessionsService = (() => {
    const sessionsEndpoint = process.env.CANNON_URL + "/session";

    const getSessions = async () => {
        const resp = await fetch(sessionsEndpoint);
        if (!resp.ok) throw new Error("Failed to fetch sessions");
        return resp.json();
    };

    return { getSessions };
})();
