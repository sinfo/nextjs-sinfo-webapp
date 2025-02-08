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
  const today = new Date().toISOString();
  const startDate = new Date(start);
  const endDate = new Date(end);

  function formatDate(date: Date) {
    return `${date.getMonth().toString().padStart(2, "0")}/${date.getFullYear()}`;
  }

  const label = `${formatDate(startDate)} - ${formatDate(endDate)}`;

  return (
    <ListCard title={field} subtitle={school} headtext={degree} label={label} />
  );
}
