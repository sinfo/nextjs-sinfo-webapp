import { LucideIcon, LucideProps } from "lucide-react";
import Image, { ImageProps } from "next/image";
import Link, { LinkProps } from "next/link";
import { ReactNode } from "react";

interface ListCardProps {
  img?: string;
  imgAltText?: string;
  imgProps?: ImageProps;
  icon?: LucideIcon;
  iconProps?: LucideProps;
  title: string;
  subtitle?: string;
  headtext?: string;
  label?: string;
  labelColor?: string;
  link?: string;
  linkProps?: LinkProps;
  extraClassName?: string;
  extraComponent?: ReactNode;
}

interface ConditionalLinkProps extends Partial<LinkProps> {
  children: ReactNode;
}

function ConditionalLink({ children, href, ...props }: ConditionalLinkProps) {
  if (!href) return children;
  return (
    <Link href={href} className="grow" {...props}>
      {children}
    </Link>
  );
}

export default function ListCard({
  title,
  img,
  imgAltText = "No alt text.",
  icon: Icon,
  subtitle,
  headtext,
  label,
  labelColor,
  link,
  extraComponent,
  imgProps,
  iconProps,
  linkProps,
  extraClassName,
}: ListCardProps) {
  return (
    <ConditionalLink href={link} {...linkProps}>
      <div
        className={`min-w-[300px] min-h-[74px] px-4 py-2 flex items-center justify-start gap-x-4 bg-white rounded-md shadow-md text-sm overflow-hidden hover:bg-slate-50 hover:shadow-sm active:bg-gray-200 active:shadow-none ${extraClassName || ""}`}
      >
        {img && (
          <Image
            className="w-[40px] h-[40px] object-contain rounded-full"
            width={40}
            height={40}
            src={img}
            alt={imgAltText}
            {...imgProps}
          />
        )}
        {Icon && <Icon {...iconProps} />}
        <div className="flex flex-col justify-start min-w-0">
          <div className="flex flex-row items-center justify-start gap-x-2 text-xs">
            {headtext && (
              <span className="text-gray-500 truncate" title={headtext}>
                {headtext}
              </span>
            )}
            {label && (
              <span
                className={`bg-sinfo-secondary text-white rounded-md px-2 py-0.5 uppercase`}
                style={labelColor ? { backgroundColor: labelColor } : undefined}
              >
                {label}
              </span>
            )}
          </div>
          <span className="truncate" title={title}>
            {title}
          </span>
          {subtitle && (
            <span className="text-xs truncate" title={subtitle}>
              {subtitle}
            </span>
          )}
        </div>
        {extraComponent}
      </div>
    </ConditionalLink>
  );
}
