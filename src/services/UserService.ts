export const UserService = (() => {
  const usersEndpoint = process.env.CANNON_URL + "/users";

  const getMe = async (cannonToken: string) => {
    const resp = await fetch(usersEndpoint + "/me", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cannonToken}`,
      },
      next: {
        revalidate: 300, // 5 mins
        tags: ["modified-me"],
      },
    });

    if (resp.ok) return resp.json();
    return null;
  };

  const demoteMe = async (cannonToken: string) => {
    const resp = await fetch(usersEndpoint + "/me", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cannonToken}`,
      },
      body: JSON.stringify({ role: "user" }),
    });
    
    if (resp.ok) return true;
    return false;
  };

  return { getMe, demoteMe };
})();
