import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Users, TrendingUp, CheckCircle2, Sparkles, XCircle } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { PieCard, BarCard } from "@/components/ChartCard";
import { LeadsTable, type Lead } from "@/components/LeadsTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { leadsApi, type Stats, type InsightsResponse } from "@/services/api";
import { InsightsCard } from "@/components/InsightsCard";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  component: DashboardPage,
});

function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [insights, setInsights] = useState<InsightsResponse | null>(null);
  const [recent, setRecent] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [s, list, ins] = await Promise.all([leadsApi.stats(), leadsApi.list(), leadsApi.insights()]);
        if (!mounted) return;
        setStats(s);
        setInsights(ins);
        setRecent((list as Lead[]).slice(0, 5));
      } catch (e) {
        toast.error("Failed to load dashboard");
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const get = (n: string) => stats?.byStatus.find((x) => x.name === n)?.value ?? 0;

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">A snapshot of your pipeline today.</p>
      </div>

      {/* Stat cards: 2 cols on mobile, 3 on sm, 5 on lg */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Total Leads" value={loading ? "…" : stats?.total ?? 0} icon={Users} tone="primary" hint="All time" />
        <StatCard label="New" value={loading ? "…" : get("New")} icon={Sparkles} tone="info" />
        <StatCard label="Interested" value={loading ? "…" : get("Interested")} icon={TrendingUp} tone="warning" />
        <StatCard label="Converted" value={loading ? "…" : get("Converted")} icon={CheckCircle2} tone="success" />
        <StatCard label="Rejected" value={loading ? "…" : get("Rejected")} icon={XCircle} tone="danger" />
      </div>

      {/* Charts: 1 col on mobile, 3 on lg */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        <PieCard title="Lead Status" data={stats?.byStatus ?? []} />
        <BarCard title="Leads by City" data={stats?.byCity ?? []} />
        <PieCard title="Leads by Service" data={stats?.byService ?? []} />
      </div>

      <InsightsCard insights={insights?.insights ?? []} loading={loading} />

      <Card className="shadow-sm">
        <CardHeader className="px-4 py-3">
          <CardTitle className="text-base font-semibold">Recent Leads</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <LeadsTable leads={recent} loading={loading} compact />
        </CardContent>
      </Card>
    </div>
  );
}
