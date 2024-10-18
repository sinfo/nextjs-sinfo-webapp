import { StaticImageData } from "next/image";
import { Image } from "next/dist/client/image-component";

interface AuthProviderButtonProps {
  icon: StaticImageData;
  name: String;
  onClick: () => {};
}

export default function AuthProviderButton({
  icon,
  name,
  onClick,
}: AuthProviderButtonProps) {
  return (
    <button
      className="w-80 h-14 bg-white text-black rounded-md flex justify-center items-center gap-4"
      onClick={onClick}
    >
      <Image height={30} src={icon} alt={`${name} Icon`} />
      Sign in with {name}
    </button>
  );
}
