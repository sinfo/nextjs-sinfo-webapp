export const CompanyService = (() => {
  const companiesEndpoint = process.env.NEXT_PUBLIC_CANNON_URL + "/company";

  const getCompany = async (id: string): Promise<Company | null> => {
    const resp = await fetch(`${companiesEndpoint}/${id}`, {
      next: {
        revalidate: 86400, // 1 day
      },
    });
    if (resp.ok) return (await resp.json()) as Company;
    return null;
  };

  const getCompanies = async (): Promise<Company[] | null> => {
    const resp = await fetch(companiesEndpoint, {
      next: {
        revalidate: 86400, // 1 day
      },
    });
    if (resp.ok) return (await resp.json()) as Company[];
    return null;
  };

  const getConnections = async (id: string): Promise<User[] | null> => {
    try {
      const resp = await fetch(`${companiesEndpoint}/${id}/connections`, {
        next: {
          revalidate: 86400, // 1 day
        },
      });
      if (resp.ok) return (await resp.json()) as User[];
    } catch (e) {
      console.error(e);
    }
    return null;
  };

  const sign = async (
    cannonToken: string,
    id: string,
    userId: string,
  ): Promise<User | null> => {
    try {
      const resp = await fetch(`${companiesEndpoint}/${id}/sign/${userId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${cannonToken}`,
        },
      });
      if (resp.ok) return (await resp.json()) as User;
    } catch (e) {
      console.error(e);
    }
    return null;
  };

  return { getCompany, getCompanies, getConnections, sign };
})();
