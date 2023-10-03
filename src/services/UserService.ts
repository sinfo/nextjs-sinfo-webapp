export const UserService = (() => {
  let me: User | null;

  const getMe = async (cannonToken: string, forceRefresh: boolean = false) => {
    if (me && !forceRefresh) return me;

    const url = process.env.CANNON_URL + "/users/me";
    const resp = await fetch(url, {
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
