import Image from "next/image";
import RedeemCode from "@/components/cupons/RedeemCode";

interface DiscountCardProps {
  discount: DiscountCode & {
    companyData?: Company;
  };
}

export default function DiscountCard({ discount }: DiscountCardProps) {
  return (
    <div className="h-full w-full max-w-[320px] sm:max-w-none">
      <div className="flex h-full min-h-[220px] w-full flex-col justify-between rounded-md bg-white p-3 shadow-md transition hover:bg-slate-50">
        <div className="flex h-full flex-col justify-between">
          <div className="flex flex-1 flex-col items-center justify-center gap-2 py-1">
            {discount.companyData?.img && (
              <Image
                src={discount.companyData.img}
                alt={`${discount.companyData?.name || "Company"} logo`}
                width={240}
                height={168}
                className="h-24 w-full object-contain"
              />
            )}
            <p className="text-sm font-semibold leading-tight line-clamp-2">
              {discount.description}
            </p>
            <p className="text-xs text-gray-600 line-clamp-1 text-center">
              {discount.companyData?.name || "Company"}
            </p>
            {/* Future use: use formatDiscountExpireDate from utils once API sends real expiration dates. */}
          </div>

          <div className="mt-3">
            <RedeemCode code={discount.code} isUrl={false} />
          </div>
        </div>
      </div>
    </div>
  );
}
