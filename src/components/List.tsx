import Link, { LinkProps } from "next/link";

export interface ListProps {
  id?: string;
  title?: string;
  description?: string;
  link?: string;
  linkText?: string;
  linkProps?: Partial<LinkProps>;
  bottomLink?: string;
  bottomLinkText?: string;
  bottomLinkProps?: LinkProps;
  children?: React.ReactNode;
}

export default function List({
  id,
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
    <div className="flex flex-col gap-y-2 p-4" id={id}>
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          {title && <span className="text-lg font-bold">{title}</span>}
          {description && (
            <span className="text-sm text-gray-600">{description}</span>
          )}
        </div>
        {linkText && (
          <Link className="text-link" href={link || "#"} {...linkProps}>
            {linkText}
          </Link>
        )}
      </div>
      <div className="flex flex-col gap-y-2 min-w-0">{children}</div>
      {bottomLinkText && (
        <Link
          className="text-link"
          href={bottomLink || "#"}
          {...bottomLinkProps}
        >
          {bottomLinkText}
        </Link>
      )}
    </div>
  );
}
