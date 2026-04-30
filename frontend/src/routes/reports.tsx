import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Download, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { LeadsTable, type Lead } from "@/components/LeadsTable";
import { leadsApi, META } from "@/services/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports — LeadFlow" },
      { name: "description", content: "Filter and export lead reports by date, city, status, or service." },
    ],
  }),
  component: ReportsPage,
});

function ReportsPage() {
  const [from, setFrom] = useState<Date | undefined>();
  const [to, setTo] = useState<Date | undefined>();
  const [city, setCity] = useState("all");
  const [status, setStatus] = useState("all");
  const [service, setService] = useState("all");
  const [rows, setRows] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const apply = async () => {
    setLoading(true);
    try {
      const data = await leadsApi.report({ from: from?.toISOString(), to: to?.toISOString(), city, status, service });
      setRows(data as Lead[]);
    } catch {
      toast.error("Could not load report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { apply(); }, []);

  const exportCsv = () => {
    if (!rows.length) {
      toast.error("No data to export");
      return;
    }

    const headers = ["Name", "Mobile", "Email", "City", "Service", "Budget", "Status", "Created At"];

    const escape = (val: string | number) => {
      const str = String(val);
      return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
    };

    const csvRows = [
      headers.join(","),
      ...rows.map((l) =>
        [l.name, l.mobile, l.email, l.city, l.service, l.budget, l.status,
          new Date(l.createdAt).toLocaleDateString("en-IN")]
          .map(escape)
          .join(",")
      ),
    ];

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success(`${rows.length} leads exported`);
  };

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Reports</h1>
        <p className="text-sm text-muted-foreground">Filter leads by date, city, service, and status.</p>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center gap-2 py-2 px-4">
          <Filter className="h-3.5 w-3.5 text-muted-foreground" />
          <CardTitle className="text-sm font-semibold">Filters</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-3 pt-0">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-6">
            <DateField label="From" value={from} onChange={setFrom} />
            <DateField label="To" value={to} onChange={setTo} />
            <FilterSelect label="City" value={city} onChange={setCity} options={META.CITIES} />
            <FilterSelect label="Status" value={status} onChange={setStatus} options={META.STATUSES} />
            <FilterSelect label="Service" value={service} onChange={setService} options={META.SERVICES} />
            <div className="flex items-end">
              <Button onClick={apply} size="sm" className="flex-1">Apply Filters</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold">Results ({rows.length})</CardTitle>
          <Button variant="outline" size="sm" onClick={exportCsv}>
            <Download className="mr-1 h-4 w-4" /> Export CSV
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <LeadsTable leads={rows} loading={loading} compact />
        </CardContent>
      </Card>
    </div>
  );
}

function FilterSelect({
  label, value, onChange, options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="flex flex-col gap-1">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          {options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}

function DateField({
  label, value, onChange,
}: {
  label: string;
  value?: Date;
  onChange: (d: Date | undefined) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn("h-8 justify-start text-xs font-normal", !value && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
            {value ? format(value, "dd MMM yy") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
            initialFocus
            className={cn("p-3 pointer-events-auto")}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
