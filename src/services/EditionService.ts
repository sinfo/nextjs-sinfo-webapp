export const EditionService = (() => {
  const eventEndpoint = process.env.CANNON_URL + "/event";

  const getCurrentEdition = async () => {
    try {
      const url = encodeURI(`${eventEndpoint}/latest`);
      const resp = await fetch(url, {
        next: { revalidate: 86400 },
      });
      if (resp.ok) return (await resp.json()).id;
    } catch (error) {
      console.log(error);
    }
    return null;
  };

  return { getCurrentEdition };
})();
