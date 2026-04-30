import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { LeadForm, type LeadFormValues } from "@/components/LeadForm";
import { LeadsTable, type Lead } from "@/components/LeadsTable";
import { leadsApi } from "@/services/api";
import { toast } from "sonner";

export const Route = createFileRoute("/leads")({
  component: LeadsPage,
});

function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Lead | null>(null);
  const [q, setQ] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const data = await leadsApi.list();
      setLeads(data as Lead[]);
    } catch {
      toast.error("Could not load leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (values: LeadFormValues) => {
    setSubmitting(true);
    try {
      if (editing) {
        await leadsApi.update(editing.id, values);
        toast.success("Lead updated");
      } else {
        await leadsApi.create(values);
        toast.success("Lead added");
      }
      setOpen(false);
      setEditing(null);
      await load();
    } catch {
      toast.error("Save failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (lead: Lead) => {
    try {
      await leadsApi.delete(lead.id);
      setLeads((prev) => prev.filter((l) => l.id !== lead.id));
      toast.success("Lead deleted");
    } catch {
      toast.error("Could not delete lead");
    }
  };

  const filtered = leads.filter((l) => {
    if (!q) return true;
    const s = q.toLowerCase();
    return (
      l.name.toLowerCase().includes(s) ||
      l.email.toLowerCase().includes(s) ||
      l.mobile.includes(s) ||
      l.city.toLowerCase().includes(s)
    );
  });

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Leads</h1>
          <p className="text-sm text-muted-foreground">{leads.length} total leads</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name, email, city…"
              className="pl-9 sm:w-72"
            />
          </div>
          <Button onClick={() => { setEditing(null); setOpen(true); }}>
            <Plus className="mr-1 h-4 w-4" /> Add Lead
          </Button>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-0">
          <LeadsTable
            leads={filtered}
            loading={loading}
            onEdit={(l) => { setEditing(l); setOpen(true); }}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Lead" : "Add New Lead"}</DialogTitle>
          </DialogHeader>
          <LeadForm
            defaultValues={editing ?? undefined}
            submitting={submitting}
            onSubmit={handleSubmit}
            onCancel={() => { setOpen(false); setEditing(null); }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
