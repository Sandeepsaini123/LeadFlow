import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const map: Record<string, string> = {
  New: "bg-info/15 text-info border-info/30",
  Interested: "bg-warning/20 text-warning-foreground border-warning/40",
  Converted: "bg-success/15 text-success border-success/30",
  Rejected: "bg-destructive/15 text-destructive border-destructive/30",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="outline" className={cn("font-medium", map[status] ?? "bg-muted text-muted-foreground")}>
      {status}
    </Badge>
  );
}
