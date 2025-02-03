import ListCard from "../ListCard";

interface AcademicTileProps {
  school: string;
  degree: string;
  field: string;
  grade?: string;
  start?: string;
  end?: string;
}

export default function AcademicTile({
  school,
  degree,
  field,
  grade,
  start,
  end,
}: AcademicTileProps) {
  let label;
  if (start && end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    label = `${startDate.getFullYear()} - ${endDate.getMonth().toString().padStart(2, "0")}/${endDate.getFullYear()}`;
  }

  return (
    <ListCard title={field} subtitle={school} headtext={degree} label={label} />
  );
}
