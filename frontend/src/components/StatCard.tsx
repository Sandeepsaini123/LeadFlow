import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  hint?: string;
  tone?: "primary" | "success" | "warning" | "info" | "danger";
}

const toneMap: Record<NonNullable<StatCardProps["tone"]>, string> = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/15 text-success",
  warning: "bg-warning/20 text-warning-foreground",
  info: "bg-info/15 text-info",
  danger: "bg-destructive/15 text-destructive",
};

export function StatCard({ label, value, icon: Icon, hint, tone = "primary" }: StatCardProps) {
  return (
    <Card className="border-border/60 shadow-sm transition hover:shadow-md">
      <CardContent className="flex items-center gap-3 p-3">
        <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", toneMap[tone])}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
          <span className="text-xl font-semibold tracking-tight">{value}</span>
          {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
        </div>
      </CardContent>
    </Card>
  );
}
