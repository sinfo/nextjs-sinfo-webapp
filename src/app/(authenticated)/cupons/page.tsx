import { DiscountService } from "@/services/DiscountService";
import { CompanyService } from "@/services/CompanyService";
import BlankPageWithMessage from "@/components/BlankPageMessage";
import List from "@/components/List";
import DiscountCard from "@/components/cupons/DiscountCard";

export default async function Discounts() {
  const [discounts, companies] = await Promise.all([
    DiscountService.getDiscounts(),
    CompanyService.getPartners(),
  ]);

  const getDiscountKey = (discount: DiscountCode): string => {
    if (discount._id?.$oid) return discount._id.$oid;
    return `${discount.company}-${discount.code}`;
  };

  if (!discounts) {
    return <BlankPageWithMessage message="No promo codes available!" />;
  }

  const companiesById = new Map(
    (companies ?? []).map((company) => [company.id, company]),
  );

  // Some promo-code company IDs may be absent from the list endpoint.
  // Resolve missing companies individually to keep cards populated.
  const missingCompanyIds = Array.from(
    new Set(
      discounts
        .map((discount) => discount.company)
        .filter((companyId) => !companiesById.has(companyId)),
    ),
  );

  if (missingCompanyIds.length > 0) {
    const missingCompanies = await Promise.all(
      missingCompanyIds.map((companyId) =>
        CompanyService.getCompany(companyId),
      ),
    );

    missingCompanies.forEach((company) => {
      if (company) companiesById.set(company.id, company);
    });
  }

  const enrichedDiscounts = discounts.map((discount) => ({
    ...discount,
    companyData: companiesById.get(discount.company),
  }));

  if (enrichedDiscounts.length === 0) {
    return <BlankPageWithMessage message="No promo codes available!" />;
  }

  return (
    <div className="container mx-auto">
      {/* Header */}
      <div className="flex flex-col items-start gap-y-2 p-4 text-start">
        <h1 className="text-2xl font-bold">Promo codes</h1>
        <p className="text-sm text-gray-600">
          Exclusive promo codes from our partner companies
        </p>
      </div>

      <List title="Offers" description="Promo codes">
        <div className="mt-3 grid grid-cols-1 justify-items-center gap-3 px-2 sm:grid-cols-2 sm:justify-items-stretch sm:px-0 lg:grid-cols-3 xl:grid-cols-4">
          {enrichedDiscounts.map((discount) => (
            <DiscountCard key={getDiscountKey(discount)} discount={discount} />
          ))}
        </div>
      </List>
    </div>
  );
}
