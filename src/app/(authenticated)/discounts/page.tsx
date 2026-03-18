import { DiscountService } from "@/services/DiscountService";
import { CompanyService } from "@/services/CompanyService";
import BlankPageWithMessage from "@/components/BlankPageMessage";
import List from "@/components/List";
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

  if (!discounts || discounts.length === 0) {
    return <BlankPageWithMessage message="No discount codes available!" />;
  }

  // Enriquecer discounts com dados da empresa
  const enrichedDiscounts = discounts.map((discount) => {
    const company = companies?.find((c) => c.id === discount.company);
    return {
      ...discount,
      companyData: company,
    };
  });

  // Ordenar por data de expiração (mais recentes primeiro)
  const sortedDiscounts = enrichedDiscounts.sort((a, b) => {
    const dateA = new Date(getExpireDate(a));
    const dateB = new Date(getExpireDate(b));
    return dateB.getTime() - dateA.getTime();
  });

  // Separar ativos e expirados
  const now = new Date();
  const activeDiscounts = sortedDiscounts.filter(
    (d) => new Date(getExpireDate(d)) > now,
  );
  const expiredDiscounts = sortedDiscounts.filter(
    (d) => new Date(getExpireDate(d)) <= now,
  );

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function hasValidUrl(value: string): boolean {
    try {
      const parsed = new URL(value);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  }

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
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {activeDiscounts.map((discount) => {
              const content = (
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
                    </div>

                    <div className="mt-3">
                      <details className="group">
                        <summary className="cursor-pointer list-none rounded-md border border-dashed border-sinfo-primary bg-sinfo-primary/10 px-3 py-2 text-center text-sm font-bold tracking-wide text-sinfo-primary transition-all duration-300 hover:bg-sinfo-primary/15 group-open:hidden">
                          Click to redeem
                        </summary>
                        <div className="grid opacity-0 transition-all duration-300 [grid-template-rows:0fr] group-open:mt-2 group-open:opacity-100 group-open:[grid-template-rows:1fr]">
                          <div className="overflow-hidden">
                            <div className="rounded-md border border-sinfo-primary/20 bg-white px-3 py-2 text-center">
                              {hasValidUrl(discount.code) ? (
                                <a
                                  href={discount.code}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm font-semibold text-sinfo-primary underline"
                                >
                                  Open redeem link
                                </a>
                              ) : (
                                <span className="block truncate text-sm font-bold tracking-wide text-sinfo-primary">
                                  {discount.code}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </details>
                    </div>
                  </div>
                </div>
              );

              return (
                <div key={getDiscountKey(discount)} className="h-full">
                  {content}
                </div>
              );
            })}
          </div>
        </List>
      )}

      {/* Expired Discounts */}
      {expiredDiscounts.length > 0 && (
        <List
          title="Expired Offers"
          description="These codes are no longer valid"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {expiredDiscounts.map((discount) => (
              <div
                key={getDiscountKey(discount)}
                className="flex h-full min-h-[220px] w-full flex-col justify-between rounded-md bg-white p-3 opacity-60 shadow-md"
              >
                <div className="flex h-full flex-col justify-between">
                  <div className="text-xs text-gray-600">
                    <span>
                      Expired on {formatDate(getExpireDate(discount))}
                    </span>
                  </div>

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
                  </div>

                  <div className="mt-3 rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-center">
                    <span className="block truncate text-sm font-bold tracking-wide text-gray-500">
                      {discount.code}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </List>
      )}
    </div>
  );
}
