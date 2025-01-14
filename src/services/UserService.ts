import { revalidateTag } from "next/cache";

export const UserService = (() => {
  const usersEndpoint = process.env.NEXT_PUBLIC_CANNON_URL + "/users";
  const filesEndpoint = process.env.NEXT_PUBLIC_CANNON_URL + "/files";

  const getUser = async (id: string): Promise<User | null> => {
    const resp = await fetch(`${usersEndpoint}/${id}`, {
      next: {
        revalidate: 86400, // 1 day
      },
    });
    if (resp.ok) return (await resp.json()) as User;
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
          revalidate: 300, // 5 mins
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
          revalidate: 300, // 5 mins
          tags: ["modified-me"],
        },
      });

      if (resp.ok) return (await resp.json()).data;
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

  const getCVInfo = async (
    cannonToken: string,
    userID?: string,
  ): Promise<SINFOFile | {} | null> => {
    try {
      if (userID) {
        const resp = await fetch(filesEndpoint + `/users/${userID}/cv`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${cannonToken}`,
          },
          next: {
            revalidate: 86400, // 1 day
            tags: ["modified-cv"],
          },
        });
        if (resp.ok) return resp.json();
      } else {
        const resp = await fetch(filesEndpoint + "/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${cannonToken}`,
          },
          next: {
            revalidate: 86400, // 1 day
            tags: ["modified-cv"],
          },
        });
        if (resp.ok) return resp.json();
      }
    } catch (error) {
      console.log(error);
    }
    return null;
  };

  const getDownloadURL = async (
    cannonToken: string,
    fileID: string,
  ): Promise<string | null> => {
    try {
      /* TODO: Implement this */
      return `${filesEndpoint}/me/download?access_token=${cannonToken}`;
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

  return {
    getUser,
    getMe,
    getQRCode,
    demoteMe,
    getCVInfo,
    getDownloadURL,
    uploadCV,
    deleteCV,
  };
})();
