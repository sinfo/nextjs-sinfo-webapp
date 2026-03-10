import { DiscountService } from "@/services/DiscountService";
import { CompanyService } from "@/services/CompanyService";
import BlankPageWithMessage from "@/components/BlankPageMessage";
import List from "@/components/List";
import ListCard from "@/components/ListCard";
import { ExternalLink } from "lucide-react";

export default async function Discounts() {
  const discounts = await DiscountService.getDiscounts();
  const companies = await CompanyService.getCompanies();

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
    const dateA = new Date(a.expire.$date);
    const dateB = new Date(b.expire.$date);
    return dateB.getTime() - dateA.getTime();
  });

  // Separar ativos e expirados
  const now = new Date();
  const activeDiscounts = sortedDiscounts.filter(
    (d) => new Date(d.expire.$date) > now,
  );
  const expiredDiscounts = sortedDiscounts.filter(
    (d) => new Date(d.expire.$date) <= now,
  );

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function isExpired(dateString: string): boolean {
    return new Date(dateString) <= now;
  }

  return (
    <div className="container mx-auto">
      {/* Header */}
      <div className="flex flex-col items-start gap-y-2 p-4 text-start">
        <h1 className="text-2xl font-bold">Discount Codes</h1>
        <p className="text-sm text-gray-600">
          Exclusive offers from our partner companies
        </p>
      </div>

      {/* Active Discounts */}
      {activeDiscounts.length > 0 && (
        <List title="Active Offers" description="Valid discount codes">
          {activeDiscounts.map((discount) => (
            <a
              key={discount._id.$oid}
              href={discount.code}
              target="_blank"
              rel="noopener noreferrer"
              className="grow"
            >
              <ListCard
                title={discount.description}
                subtitle={discount.companyData?.name || "Company"}
                img={discount.companyData?.img}
                imgAltText={`${discount.companyData?.name} logo`}
                headtext={`Valid until ${formatDate(discount.expire.$date)}`}
                icon={ExternalLink}
                iconProps={{ size: 16, className: "text-sinfo-primary" }}
                labelColor="bg-green-500"
              />
            </a>
          ))}
        </List>
      )}

      {/* Expired Discounts */}
      {expiredDiscounts.length > 0 && (
        <List
          title="Expired Offers"
          description="These codes are no longer valid"
        >
          {expiredDiscounts.map((discount) => (
            <ListCard
              key={discount._id.$oid}
              title={discount.description}
              subtitle={discount.companyData?.name || "Company"}
              img={discount.companyData?.img}
              imgAltText={`${discount.companyData?.name} logo`}
              headtext={`Expired on ${formatDate(discount.expire.$date)}`}
              label="Expired"
              labelColor="bg-gray-400"
              extraClassName="opacity-60"
            />
          ))}
        </List>
      )}
    </div>
  );
}
