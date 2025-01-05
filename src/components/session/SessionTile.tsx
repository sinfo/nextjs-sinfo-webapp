import ListCard from "@/components/ListCard";

interface SesionTileProps {
  img?: string;
  title: string;
  time: string;
  presenter?: Speaker | Company | null;
  type: string;
}

export function SessionTile({
  img,
  title,
  time,
  presenter,
  type,
}: SesionTileProps) {
  return (
    <ListCard
      title={title}
      subtitle={presenter ? presenter.name : "Unknown"}
      img={img}
      headtext={time}
      label={type}
    />
  );
}
