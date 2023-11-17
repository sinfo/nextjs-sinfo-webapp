export const CompanyService = (() => {
  const companiesEndpoint = process.env.CANNON_URL + "/company";

  const getCompany = async (id: string) => {
    const resp = await fetch(companiesEndpoint + "/" + id, {
      next: {
        revalidate: 86400, // 1 day
      },
    });
    if (resp.ok) return resp.json();
    return null;
  };

  return { getCompany };
})();
