import { revalidateTag } from "next/cache";
import { EditionService } from "./EditionService";

export const UserService = (() => {
  const usersEndpoint = process.env.CANNON_URL + "/users";
  const filesEndpoint = process.env.CANNON_URL + "/files";

  const getMe = async (cannonToken: string) => {
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

      if (resp.ok) return resp.json();
    } catch (error) {
      console.error(error);
    }
    return null;
  };

  const demoteMe = async (cannonToken: string) => {
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

      if (resp.ok) {
        success = true;
        revalidateTag("modified-me");
      }
    } catch (error) {
      console.error(error);
    }
    return success;
  };

  const getUser = async (cannonToken: string, userId: string) => {
    try {
      const editionId: string = await EditionService.getCurrentEdition();
      const url = encodeURI(
        `${usersEndpoint}/${userId}?editionId=${editionId}`
      );
      const resp = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cannonToken}`,
        },
        next: {
          revalidate: 600, // 5 mins
        },
      });
      if (resp.ok) return resp.json();
    } catch (error) {
      console.error(error);
    }
    return null;
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
      console.error(error);
    }
    return success;
  };

  const createLink = async (
    cannonToken: string,
    userId: string,
    scannedUserId: string,
    companyId: string,
    notes: string
  ) => {
    let success = false;
    try {
      const url = encodeURI(`${usersEndpoint}/${userId}/link`);
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cannonToken}`,
        },
        body: JSON.stringify({
          userId: scannedUserId,
          companyId,
          notes: {
            contacts: { email: "" },
            internships: "",
            otherObservations: notes,
          },
        }),
      });
      if (resp.ok) {
        success = true;
        revalidateTag("modified-links");
      }
    } catch (error) {
      console.error(error);
    }
    return success;
  };

  const getLink = async (
    cannonToken: string,
    userId: string,
    companyId: string
  ) => {
    try {
      const url = encodeURI(`${usersEndpoint}/${userId}/link/${companyId}`);
      const resp = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cannonToken}`,
        },
      });
      if (resp.ok) return resp.json();
    } catch (error) {
      console.error(error);
    }
    return null;
  };

  return {
    getMe,
    demoteMe,
    getUser,
    getCVInfo,
    uploadCV,
    deleteCV,
    createLink,
    getLink,
  };
})();
