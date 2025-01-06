import GridCard from "@/components/GridCard";
import { isHereToday } from "@/utils/company";

interface CompanyTileProps {
  company: Company;
}

export function CompanyTile({ company }: CompanyTileProps) {
  return (
    <GridCard
      title={company.name}
      img={company.img}
      imgAltText={`${company.name} logo`}
      link={`/companies/${company.id}`}
      {...(isHereToday(company) && { label: "Here Today" })}
    />
  );
}
