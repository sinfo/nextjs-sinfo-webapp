import Link, { LinkProps } from "next/link";

export interface ListProps {
  title?: string;
  description?: string;
  link?: string;
  linkText?: string;
  linkProps?: LinkProps;
  bottomLink?: string;
  bottomLinkText?: string;
  bottomLinkProps?: LinkProps;
  children?: React.ReactNode;
}

export default function List({
  title,
  description,
  link,
  linkText,
  linkProps,
  bottomLink,
  bottomLinkText,
  bottomLinkProps,
  children,
}: ListProps) {
  return (
    <div className="flex flex-col gap-y-2 p-4">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          {title && <span className="text-lg font-bold">{title}</span>}
          {description && (
            <span className="text-sm text-gray-500">{description}</span>
          )}
        </div>
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
      {bottomLinkText && (
        <Link
          className="text-sm text-blue-500 hover:underline active:text-blue-900"
          href={bottomLink || "#"}
          {...bottomLinkProps}
        >
          {bottomLinkText}
        </Link>
      )}
    </div>
  );
}
