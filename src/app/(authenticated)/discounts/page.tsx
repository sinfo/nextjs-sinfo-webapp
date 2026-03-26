import { DiscountService } from "@/services/DiscountService";
import { CompanyService } from "@/services/CompanyService";
import BlankPageWithMessage from "@/components/BlankPageMessage";
import List from "@/components/List";
import RedeemCode from "@/components/discount/RedeemCode";
import Image from "next/image";

export default async function Discounts() {
  const discounts = await DiscountService.getDiscounts();
  const companies = await CompanyService.getCompanies();

  const getExpireDate = (discount: DiscountCode): string =>
    typeof discount.expire === "string"
      ? discount.expire
      : discount.expire.$date;

  const getDiscountKey = (discount: DiscountCode): string => {
    if (discount._id?.$oid) return discount._id.$oid;
    return `${discount.company}-${discount.code}-${getExpireDate(discount)}`;
  };

  const formatExpireDate = (discount: DiscountCode): string =>
    new Date(getExpireDate(discount)).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });

  if (!discounts || discounts.length === 0) {
    return <BlankPageWithMessage message="No discount codes available!" />;
  }

  const companiesById = new Map(
    (companies ?? []).map((company) => [company.id, company]),
  );

  const enrichedDiscounts = discounts.map((discount) => ({
    ...discount,
    companyData: companiesById.get(discount.company),
  }));

  const sortedDiscounts = enrichedDiscounts.sort((a, b) => {
    const dateA = new Date(getExpireDate(a));
    const dateB = new Date(getExpireDate(b));
    return dateB.getTime() - dateA.getTime();
  });

  const now = new Date();
  const activeDiscounts = sortedDiscounts.filter(
    (discount) => new Date(getExpireDate(discount)) > now,
  );

  function hasValidUrl(value: string): boolean {
    try {
      const parsed = new URL(value);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  }

  const renderDiscountCard = (discount: (typeof sortedDiscounts)[number]) => (
    <div
      key={getDiscountKey(discount)}
      className="h-full w-full max-w-[320px] sm:max-w-none"
    >
      <div className="flex h-full min-h-[220px] w-full flex-col justify-between rounded-md bg-white p-3 shadow-md transition hover:bg-slate-50">
        <div className="flex h-full flex-col justify-between">
          <div className="flex flex-1 flex-col items-center justify-center gap-2 py-1">
            {discount.companyData?.img && (
              <Image
                src={discount.companyData.img}
                alt={`${discount.companyData?.name || "Company"} logo`}
                width={240}
                height={168}
                className="h-24 w-full object-contain"
              />
            )}
            <p className="text-sm font-semibold leading-tight line-clamp-2">
              {discount.description}
            </p>
            <p className="text-xs text-gray-600 line-clamp-1 text-center">
              {discount.companyData?.name || "Company"}
            </p>
            <p className="text-xs text-gray-500 text-center">
              Valid until {formatExpireDate(discount)}
            </p>
          </div>

          <div className="mt-3">
            <RedeemCode
              code={discount.code}
              isUrl={hasValidUrl(discount.code)}
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto">
      {/* Header */}
      <div className="flex flex-col items-start gap-y-2 p-4 text-start">
        <h1 className="text-2xl font-bold">Cupons</h1>
        <p className="text-sm text-gray-600">
          Exclusive offers from our partner companies
        </p>
      </div>

      {/* Active Discounts */}
      {activeDiscounts.length > 0 && (
        <List title="Active Offers" description="Valid discount codes">
          <div className="mt-3 grid grid-cols-1 justify-items-center gap-3 px-2 sm:grid-cols-2 sm:justify-items-stretch sm:px-0 lg:grid-cols-3 xl:grid-cols-4">
            {activeDiscounts.map((discount) => renderDiscountCard(discount))}
          </div>
        </List>
      )}
    </div>
  );
}
