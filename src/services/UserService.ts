import { revalidateTag } from "next/cache";

export const UserService = (() => {
  const usersEndpoint = process.env.CANNON_URL + "/users";
  const filesEndpoint = process.env.CANNON_URL + "/files";

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

  const getCVInfo = async (cannonToken: string) => {
    try {
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
    } catch (error) {
      console.log(error);
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

  return { getMe, demoteMe, getCVInfo, uploadCV, deleteCV };
})();
