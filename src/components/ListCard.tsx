import { LucideIcon, LucideProps } from "lucide-react";
import Image, { ImageProps } from "next/image";
import Link, { LinkProps } from "next/link";

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
  link?: string;
  linkProps?: LinkProps;
  extraClassName?: string;
}

export default function ListCard({
  title,
  img,
  imgAltText = "No alt text.",
  icon: Icon,
  subtitle,
  headtext,
  label,
  link,
  imgProps,
  iconProps,
  linkProps,
  extraClassName,
}: ListCardProps) {
  return (
    <Link href={link || "#"} {...linkProps}>
      <div
        className={`min-w-[340px] min-h-[74px] px-4 py-2 flex items-center justify-start gap-x-4 bg-white rounded-md shadow-md text-sm overflow-hidden hover:bg-slate-50 hover:shadow-sm active:bg-gray-200 active:shadow-none ${extraClassName || ""}`}
      >
        {img && (
          <Image
            className="rounded-full"
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
              <span className="bg-blue-dark text-white rounded-md px-2 py-0.5 uppercase">
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
      </div>
    </Link>
  );
}
