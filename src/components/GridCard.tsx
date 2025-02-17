import Image from "next/image";
import Link, { LinkProps } from "next/link";

interface GridCardProps {
  title: string;
  img: string;
  imgAltText?: string;
  extraImage?: string;
  extraImageAltText?: string;
  label?: string;
  link?: string;
  linkProps?: LinkProps;
}

export default function GridCard({
  title,
  img,
  imgAltText = "No alt text.",
  extraImage,
  extraImageAltText = "No alt text.",
  label,
  link,
  linkProps,
}: GridCardProps) {
  return (
    <Link href={link || "#"} {...linkProps}>
      <div className="w-[160px] min-h-[240px] flex flex-col items-center justify-between px-4 py-4 gap-y-2 text-sm bg-white rounded-md shadow-md text-center overflow-hidden hover:bg-slate-50 hover:shadow-sm active:bg-gray-200 active:shadow-none">
        <span title={title} className="h-10 w-full line-clamp-2">
          {title}
        </span>
        <Image
          className="w-[128px] h-[128px] object-contain"
          width={128}
          height={128}
          src={img}
          alt={imgAltText}
        />
        <div className="h-[32px]">
          {extraImage && (
            <Image
              className="w-[100px] h-[32px] object-contain"
              width={100}
              height={32}
              src={extraImage}
              alt={extraImageAltText}
            />
          )}
          {label && (
            <span className="m-auto bg-sinfo-secondary font-bold text-white rounded-md px-2 py-1 uppercase">
              {label}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
