interface ProgressBarProps {
  title: string;
  current: number;
  maximum: number;
  className?: string;
  children?: React.ReactNode;
}

export default function ProgressBar({
  title,
  current,
  maximum,
  className = "",
  children,
}: ProgressBarProps) {
  return (
    <div className={`p-4 flex flex-col gap-2 ${className}`}>
      <div className="flex flex-row justify-between items-center">
        <span className="font-medium">{title}</span>
        <span>{`${current} / ${maximum}`}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-md h-2">
        <div
          className={`bg-sinfo-tertiary rounded-md h-2`}
          style={{
            width: `${(current / maximum) * 100}%`,
          }}
        />
      </div>
      {children}
    </div>
  );
}
