import { revalidateTag } from "next/cache";

export const CompanyService = (() => {
  const companiesEndpoint = process.env.CANNON_URL + "/company";

  const getCompany = async (id: string) => {
    try {
      const url = encodeURI(companiesEndpoint + "/" + id);
      const resp = await fetch(url, {
        next: {
          revalidate: 86400, // 1 day
        },
      });
      if (resp.ok) return resp.json();
    } catch (error) {
      console.error(error);
    }
    return null;
  };

  const createLink = async (
    cannonToken: string,
    userId: string,
    scannedUserId: string,
    companyId: string,
    notes: String
  ) => {
    let success = false;
    try {
      const url = `${companiesEndpoint}/${encodeURIComponent(companyId)}/link`;
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cannonToken}`,
        },
        body: JSON.stringify({
          userId,
          attendeeId: scannedUserId,
          notes: {
            contacts: {
              email: "",
              phone: "",
            },
            interestedIn: "",
            degree: "",
            availability: "",
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
    companyId: string,
    scannedUserId: string
  ) => {
    try {
      const url = encodeURI(
        `${companiesEndpoint}/${companyId}/link/${scannedUserId}`
      );
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

  return { getCompany, createLink, getLink };
})();
