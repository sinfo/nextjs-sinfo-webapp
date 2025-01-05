import GridCard from "@/components/GridCard";

interface CompanyTileProps {
  id: string;
  name: string;
  img: string;
  imgAltText?: string;
  hereToday?: boolean;
}

export function CompanyTile({
  id,
  name,
  img,
  imgAltText = "No alt text.",
  hereToday = false,
}: CompanyTileProps) {
  return (
    <GridCard
      title={name}
      img={img}
      imgAltText={imgAltText}
      link={`/companies/${id}`}
      {...(hereToday && { label: "Here Today" })}
    />
  );
}
