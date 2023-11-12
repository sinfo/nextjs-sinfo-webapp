export const UserService = (() => {
  let me: User | null;

  const usersEndpoint = process.env.CANNON_URL + "/users";

  const getMe = async (cannonToken: string, forceRefresh: boolean = false) => {
    if (me && !forceRefresh) return me;

    const resp = await fetch(usersEndpoint + "/me", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cannonToken}`,
      },
    });

    if (resp.ok) {
      me = await resp.json();
      return me;
    }

    me = null;
    return null;
  };

  return { getMe };
})();
