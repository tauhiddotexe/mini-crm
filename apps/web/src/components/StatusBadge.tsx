import { Badge } from "./Badge";

interface StatusBadgeProps {
  status: "Open" | "In Progress" | "Closed";
}

const config = {
  Open: { variant: "default" as const, dot: "bg-primary" },
  "In Progress": { variant: "warning" as const, dot: "bg-warning" },
  Closed: { variant: "destructive" as const, dot: "bg-destructive" },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const { variant, dot } = config[status];
  return (
    <Badge variant={variant}>
      <span className={`relative flex h-2 w-2 mr-1.5`}>
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${dot} opacity-75`} />
        <span className={`relative inline-flex rounded-full h-2 w-2 ${dot}`} />
      </span>
      {status}
    </Badge>
  );
}
