export const DiscountService = (() => {
  const baseUrl = process.env.NEXT_PUBLIC_CANNON_URL;
  const discountsEndpoints = ["/promo-code", "/promocodes"];

  const getDiscounts = async (): Promise<DiscountCode[] | null> => {
    try {
      if (!baseUrl) {
        console.error("Missing NEXT_PUBLIC_CANNON_URL");
        return null;
      }

      for (const endpoint of discountsEndpoints) {
        const resp = await fetch(baseUrl + endpoint, {
          next: {
            revalidate: 0,
          },
        });

        if (resp.ok) return (await resp.json()) as DiscountCode[];
      }
    } catch (e) {
      console.error("Error fetching discounts:", e);
    }
    return null;
  };

  return { getDiscounts };
})();
