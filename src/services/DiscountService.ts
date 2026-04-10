export const DiscountService = (() => {
  const discountsEndpoint = process.env.NEXT_PUBLIC_CANNON_URL + "/promo-code";

  const getDiscounts = async (): Promise<DiscountCode[] | null> => {
    const resp = await fetch(discountsEndpoint, {
      next: {
        revalidate: 0, // 1 day
      },
    });
    if (resp.ok) return (await resp.json()) as DiscountCode[];
    return null;
  };

  return { getDiscounts };
})();
