import ListCard from "../ListCard";

interface AcademicTileProps {
  school: string;
  degree: string;
  field: string;
  grade?: string;
  start: string;
  end: string;
}

export default function AcademicTile({
  school,
  degree,
  field,
  start,
  end,
}: AcademicTileProps) {
  const startDate = new Date(start);
  const endDate = new Date(end);

  function formatDate(date: Date) {
    return date.toLocaleDateString("en-GB", {
      month: "2-digit",
      year: "numeric",
    });
  }

  const label = `${formatDate(startDate)} - ${formatDate(endDate)}`;

  return (
    <ListCard title={field} subtitle={school} headtext={degree} label={label} />
  );
}
