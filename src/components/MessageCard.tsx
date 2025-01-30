import {
  Check,
  Info,
  LucideIcon,
  OctagonAlert,
  TriangleAlert,
} from "lucide-react";

type MessageType = "success" | "info" | "warning" | "danger";

interface MessageCardProps {
  type: MessageType;
  title?: string;
  content?: string;
  onClick?: () => void;
}

interface MessageCustomization {
  class: string;
  icon: LucideIcon;
}

const customizationByType: Record<MessageType, MessageCustomization> = {
  success: {
    class: "border-green-500 text-green-500",
    icon: Check,
  },
  info: {
    class: "border-blue-500 text-blue-500",
    icon: Info,
  },
  warning: {
    class: "border-yellow-500 text-yellow-500",
    icon: TriangleAlert,
  },
  danger: {
    class: "border-red-500 text-red-500",
    icon: OctagonAlert,
  },
};

export default function MessageCard({
  type,
  title,
  content,
  onClick,
}: MessageCardProps) {
  const Icon = customizationByType[type].icon;

  return (
    <div
      className={`flex w-full justify-start items-center gap-x-4 px-4 py-2 bg-white border-l-4 rounded-md shadow-md text-sm ${customizationByType[type].class} ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
    >
      <Icon size={32} />
      <div>
        {title && <span className="text-base text-black">{title}</span>}
        {content && <p className="text-gray-500 ">{content}</p>}
      </div>
    </div>
  );
}
