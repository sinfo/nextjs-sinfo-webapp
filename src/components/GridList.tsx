import List, { ListProps } from "@/components/List";

interface GridListProps extends ListProps {
  scrollable?: boolean;
  className?: string;
}

export default function GridList({
  children,
  scrollable,
  className = ``,
  ...props
}: GridListProps) {
  return (
    <List {...props}>
      <div
        className={`flex flex-row gap-2 ${scrollable ? "justify-start overflow-x-auto pb-4" : "justify-around flex-wrap"} ${className}`}
      >
        {children}
      </div>
    </List>
  );
}
