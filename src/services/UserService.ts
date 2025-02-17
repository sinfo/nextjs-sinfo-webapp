import { revalidateTag } from "next/cache";

export const UserService = (() => {
  const usersEndpoint = process.env.NEXT_PUBLIC_CANNON_URL + "/users";
  const filesEndpoint = process.env.NEXT_PUBLIC_CANNON_URL + "/files";

  const getUser = async (
    cannonToken: string,
    id: string,
  ): Promise<User | null> => {
    const resp = await fetch(`${usersEndpoint}/${id}`, {
      headers: {
        Authorization: `Bearer ${cannonToken}`,
      },
      next: {
        revalidate: 0, // 1 day
      },
    });
    if (resp.ok) return (await resp.json()) as User;
    return null;
  };

  const getActiveUsersByDay = async (
    cannonToken: string,
    day: string,
  ): Promise<User[] | null> => {
    try {
      const resp = await fetch(`${usersEndpoint}?date=${day}`, {
        headers: {
          Authorization: `Bearer ${cannonToken}`,
        },
        next: {
          revalidate: 0, // 1 day
        },
      });
      if (resp.ok) return (await resp.json()) as User[];
    } catch (err) {
      console.error(err);
    }
    return null;
  };

  const getMe = async (cannonToken: string): Promise<User | null> => {
    try {
      const resp = await fetch(usersEndpoint + "/me", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cannonToken}`,
        },
        next: {
          revalidate: 0, // 1 day
          tags: ["modified-me"],
        },
      });

      if (resp.ok) return (await resp.json()) as User;
    } catch (error) {
      console.error(error);
    }
    return null;
  };

  const getQRCode = async (cannonToken: string): Promise<string | null> => {
    try {
      const resp = await fetch(usersEndpoint + "/qr-code", {
        headers: {
          Authorization: `Bearer ${cannonToken}`,
        },
        next: {
          revalidate: 0, // 1 day
          tags: ["modified-me"],
        },
      });

      if (resp.ok) return (await resp.json()).token;
    } catch (error) {
      console.error(error);
    }
    return null;
  };

  const demoteMe = async (cannonToken: string): Promise<boolean> => {
    let success = false;

    try {
      const resp = await fetch(usersEndpoint + "/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cannonToken}`,
        },
        body: JSON.stringify({ role: "user" }),
      });

      if (resp.ok) success = true;
    } catch (error) {
      console.error(error);
    }
    return success;
  };

  const updateMe = async (
    cannonToken: string,
    user: User,
  ): Promise<User | null> => {
    try {
      const resp = await fetch(usersEndpoint + "/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cannonToken}`,
        },
        body: JSON.stringify({
          ...user,
          id: undefined,
          role: undefined,
          company: undefined,
        }),
      });
      if (resp.ok) {
        revalidateTag(`modified-me`);
        return (await resp.json()) as User;
      }
    } catch (error) {
      console.error(error);
    }
    return null;
  };

  const getCVInfo = async (
    cannonToken: string,
    id?: string,
  ): Promise<SINFOFile | {} | null> => {
    try {
      const resp = await fetch(
        id ? filesEndpoint + `/users/${id}` : filesEndpoint + "/me",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${cannonToken}`,
          },
          next: {
            revalidate: 0, // 1 day
            tags: ["modified-cv"],
          },
        },
      );
      if (resp.ok) return resp.json();
    } catch (error) {
      console.log(error);
    }
    return null;
  };

  const getDownloadURL = async (
    cannonToken: string,
    fileID?: string,
  ): Promise<string | null> => {
    try {
      return `${filesEndpoint}/${fileID || "me"}/download?access_token=${cannonToken}`;
    } catch (error) {
      console.error(error);
    }
    return null;
  };

  const uploadCV = async (cannonToken: string, cv: File) => {
    let success = false;

    try {
      let formData = new FormData();
      formData.append("file", cv, cv.name);

      const resp = await fetch(filesEndpoint + "/me", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${cannonToken}`,
        },
        body: formData,
      });

      if (resp.ok) {
        revalidateTag("modified-cv");
        success = true;
      }
    } catch (error) {
      console.error(error);
    }
    return success;
  };

  const deleteCV = async (cannonToken: string) => {
    let success = false;

    try {
      const resp = await fetch(filesEndpoint + "/me", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${cannonToken}`,
        },
      });

      if (resp.ok) {
        revalidateTag("modified-cv");
        success = true;
      }
    } catch (error) {
      console.log(error);
    }
    return success;
  };

  type PromoteOptions =
    | {
        role: "company";
        company: {
          company: string;
          edition?: string;
        };
      }
    | {
        role: "team" | "admin";
      };

  const promote = async (
    cannonToken: string,
    id: string,
    options: PromoteOptions,
  ): Promise<boolean> => {
    try {
      const resp = await fetch(usersEndpoint + `/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cannonToken}`,
        },
        body: JSON.stringify(options),
      });

      if (resp.ok) return true;
    } catch (error) {
      console.error(error);
    }
    return false;
  };

  const demote = async (cannonToken: string, id: string): Promise<boolean> => {
    try {
      const resp = await fetch(usersEndpoint + `/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cannonToken}`,
        },
        body: JSON.stringify({ role: "user" }),
      });

      if (resp.ok) return true;
    } catch (error) {
      console.error(error);
    }
    return false;
  };

  const validateSpinWheel = async (
    cannonToken: string,
    id: string,
  ): Promise<boolean> => {
    try {
      const resp = await fetch(`${usersEndpoint}/${id}/redeem-card`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${cannonToken}`,
        },
      });

      if (resp.ok) return true;
    } catch (error) {
      console.error(error);
    }
    return false;
  };

  const getConnections = async (
    cannonToken: string,
  ): Promise<Connection[] | null> => {
    try {
      const resp = await fetch(`${usersEndpoint}/me/connections`, {
        headers: {
          Authorization: `Bearer ${cannonToken}`,
        },
        next: {
          revalidate: 0, // 1 day
          tags: ["updated-connection"],
        },
      });
      if (resp.ok) return (await resp.json()) as Connection[];
    } catch (err) {
      console.error(err);
    }
    return null;
  };

  const connect = async (
    cannonToken: string,
    to: string,
    notes?: string,
  ): Promise<Connection | null> => {
    try {
      const resp = await fetch(`${usersEndpoint}/me/connections`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cannonToken}`,
        },
        body: JSON.stringify({ to, notes }),
      });

      if (resp.ok) return (await resp.json()) as Connection;
    } catch (error) {
      console.error(error);
    }
    return null;
  };

  const updateConnection = async (
    cannonToken: string,
    to: string,
    notes?: string,
  ): Promise<Connection | null> => {
    try {
      const resp = await fetch(`${usersEndpoint}/me/connections/${to}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cannonToken}`,
        },
        body: JSON.stringify({ notes }),
      });

      if (resp.ok) {
        revalidateTag("updated-connection");
        return (await resp.json()) as Connection;
      }
    } catch (error) {
      console.error(error);
    }
    return null;
  };

  const removeConnection = async (
    cannonToken: string,
    to: string,
  ): Promise<Connection | null> => {
    try {
      const resp = await fetch(`${usersEndpoint}/me/connections/${to}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${cannonToken}`,
        },
      });

      if (resp.ok) {
        return (await resp.json()) as Connection;
      }
    } catch (error) {
      console.error(error);
    }
    return null;
  };

  return {
    getUser,
    getActiveUsersByDay,
    getMe,
    getQRCode,
    demoteMe,
    updateMe,
    getCVInfo,
    getDownloadURL,
    uploadCV,
    deleteCV,
    promote,
    demote,
    validateSpinWheel,
    getConnections,
    connect,
    updateConnection,
    removeConnection,
  };
})();
