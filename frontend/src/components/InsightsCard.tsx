import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, MapPin, Briefcase, IndianRupee, AlertCircle, Zap, Lightbulb } from "lucide-react";
import type { Insight } from "@/services/api";

const iconMap: Record<string, React.ElementType> = {
  "trending-up": TrendingUp,
  "map-pin": MapPin,
  "briefcase": Briefcase,
  "indian-rupee": IndianRupee,
  "alert-circle": AlertCircle,
  "zap": Zap,
};

const typeStyles: Record<string, string> = {
  conversion: "bg-primary/10 text-primary",
  city: "bg-info/15 text-info",
  service: "bg-warning/20 text-warning-foreground",
  budget: "bg-success/15 text-success",
  warning: "bg-destructive/15 text-destructive",
  action: "bg-primary/10 text-primary",
};

interface Props {
  insights: Insight[];
  loading?: boolean;
}

export function InsightsCard({ insights, loading }: Props) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center gap-2 pb-2 pt-4 px-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
          <Lightbulb className="h-4 w-4 text-primary" />
        </div>
        <CardTitle className="text-sm font-semibold">AI Insights</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded-md bg-muted" />
            ))}
          </div>
        ) : insights.length === 0 ? (
          <p className="text-sm text-muted-foreground">Add some leads to see insights.</p>
        ) : (
          <ul className="space-y-2">
            {insights.map((insight, i) => {
              const Icon = iconMap[insight.icon] ?? Lightbulb;
              const style = typeStyles[insight.type] ?? "bg-muted text-muted-foreground";
              return (
                <li key={i} className="flex items-start gap-3 rounded-lg border border-border/50 p-3">
                  <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${style}`}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <p className="text-sm text-foreground leading-snug">{insight.text}</p>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
