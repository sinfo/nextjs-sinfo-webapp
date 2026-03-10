export const DiscountService = (() => {
  const discountsEndpoint = process.env.NEXT_PUBLIC_CANNON_URL + "/promocodes";

  const getDiscounts = async (): Promise<DiscountCode[] | null> => {
    try {
      const resp = await fetch(discountsEndpoint, {
        next: {
          revalidate: 0, // no cache - sempre busca dados frescos
        },
      });
      if (resp.ok) return (await resp.json()) as DiscountCode[];
    } catch (e) {
      console.error("Error fetching discounts:", e);
    }
    return null;
  };

  return { getDiscounts };
})();
