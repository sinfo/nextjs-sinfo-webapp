import ConnectButton from "./ConnectButton";
import DemoteButton from "./DemoteButton";
import ValidateSpinButton from "./ValidateSpinButton";

export interface ProfileButtonProps {
  cannonToken: string;
  user: User;
  otherUser: User;
  connections: Connection[];
  edition?: string;
}

export default function ProfileButtons(buttonProps: ProfileButtonProps) {
  return (
    <div className="px-4 pb-2 flex flex-col lg:flex-row gap-2 [&>button]:w-full [&>button]:lg:w-60 text-sm">
      <ConnectButton {...buttonProps} />
      <ValidateSpinButton {...buttonProps} />
      <DemoteButton {...buttonProps} />
    </div>
  );
}
