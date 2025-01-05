import Link, { LinkProps } from "next/link";

export interface ListProps {
  title: string;
  link?: string;
  linkText?: string;
  linkProps?: LinkProps;
  children: React.ReactNode;
}

export default function List({
  title,
  link,
  linkText,
  linkProps,
  children,
}: ListProps) {
  return (
    <div className="flex flex-col gap-y-2 p-4">
      <div className="flex justify-between items-center">
        <span className="text-lg font-bold">{title}</span>
        {linkText && (
          <Link
            className="text-blue-500 hover:underline active:text-blue-900"
            href={link || "#"}
            {...linkProps}
          >
            {linkText}
          </Link>
        )}
      </div>
      <div className="flex flex-col gap-y-2 min-w-0">{children}</div>
    </div>
  );
}
