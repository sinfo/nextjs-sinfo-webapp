import { X } from "lucide-react";
import { ReactNode } from "react";

interface ModalProps {
  children?: ReactNode;
  title?: string;
  open: boolean;
  onClose: () => void;
}

export default function ModalElement({
  children,
  title,
  open,
  onClose,
}: ModalProps) {
  if (!open) return <></>;

  return (
    <div className="fixed top-0 right-0 left-0 bottom-0 z-50 flex justify-center items-center bg-black/[0.4] px-1">
      <div className="relative w-full max-w-2xl z-60 max-h-full bg-white text-black rounded-md">
        <header className="flex items-center justify-between border-b p-4">
          <div>
            {title && <h4 className="font-xl font-semibold">{title}</h4>}
          </div>
          <button className="text-gray-500 z-70" onClick={onClose}>
            <X />
          </button>
        </header>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
