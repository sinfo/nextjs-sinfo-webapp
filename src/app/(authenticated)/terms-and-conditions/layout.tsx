import { ReactNode } from "react";

export default function TermsAndConditionsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="container m-auto h-full text-black">
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Terms and conditions</h2>
        <div className="flex flex-col justify-start items-start gap-4">
          {children}
        </div>
      </div>
    </div>
  );
}
