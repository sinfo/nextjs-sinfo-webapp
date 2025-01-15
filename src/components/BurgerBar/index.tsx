import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { X } from "lucide-react";
import BurgerItem, { BurgerbarItemKey } from "./BurgerItem";
import { convertToAppRole } from "@/utils/utils";
import { UserService } from "@/services/UserService";

const burgerItemKeysByRole: Record<UserRole, BurgerbarItemKey[]> = {
  Attendee: ["groupcv", "groupevents", "groupcompanies", "groupgeneral"],
  Company: ["groupevents", "groupcompanies", "groupgeneral"],
  Member: ["groupcv", "groupevents", "groupcompanies", "groupgeneral"],
  Admin: ["groupcv", "groupevents", "groupcompanies", "groupgeneral"]
};

interface BurgerBarProps {
    onCloseAction: () => void;
}

export default function BurgerBar({ onCloseAction }: BurgerBarProps) {
  const { data: session } = useSession();
  const [burgerItemKeys, setBurgerItemKeys] = useState<BurgerbarItemKey[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    async function fetchUserRole() {
      if (session?.user) {
        const user = await UserService.getMe(session.cannonToken);
        if (user) {
          const userRole = convertToAppRole(user.role);
          setBurgerItemKeys(burgerItemKeysByRole[userRole]);
        }
      }
      setIsVisible(true);
    }
    fetchUserRole();
  }, [session]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onCloseAction, 300);
  };

  if (!session?.user) return null;

  return (
    <div className={`fixed inset-0 bg-[rgb(50,51,99)] z-50 flex flex-col transition-opacity duration-300 ${isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      <div className="flex justify-end p-4">
        <X size={32} onClick={handleClose} className="cursor-pointer" />
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {burgerItemKeys.map((key) => (
          <div key={key} className="mb-8"> {/* Aumentar o espaçamento entre os grupos */}
            <BurgerItem name={key} />
          </div>
        ))}
      </div>
    </div>
  );
}