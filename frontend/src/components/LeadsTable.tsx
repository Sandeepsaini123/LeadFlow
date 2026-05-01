import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";

export interface Lead {
  id: string;
  name: string;
  mobile: string;
  email: string;
  city: string;
  service: string;
  budget: number;
  status: "New" | "Interested" | "Converted" | "Rejected";
  createdAt: string;
}

interface Props {
  leads: Lead[];
  loading?: boolean;
  onEdit?: (lead: Lead) => void;
  onDelete?: (lead: Lead) => void;
  compact?: boolean;
}

export function LeadsTable({ leads, loading, onEdit, onDelete, compact }: Props) {
  if (loading) {
    return (
      <div className="space-y-2 p-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-10 animate-pulse rounded-md bg-muted" />
        ))}
      </div>
    );
  }

  if (!leads.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 p-12 text-center">
        <p className="text-sm font-medium text-foreground">No leads found</p>
        <p className="text-xs text-muted-foreground">Try adjusting your filters or add a new lead.</p>
      </div>
    );
  }

  const showActions = !compact && (onEdit || onDelete);

  return (
    <>
      {/* Mobile card view */}
      <div className="block md:hidden divide-y divide-border">
        {leads.map((l) => (
          <div key={l.id} className="p-4 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium text-sm">{l.name}</p>
                <p className="text-xs text-muted-foreground">{l.mobile}</p>
                <p className="text-xs text-muted-foreground">{l.email}</p>
              </div>
              <StatusBadge status={l.status} />
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span>{l.city}</span>
              <span>{l.service}</span>
              <span className="font-medium text-foreground">₹{l.budget.toLocaleString("en-IN")}</span>
              <span>{format(new Date(l.createdAt), "dd MMM yyyy")}</span>
            </div>
            {showActions && (
              <div className="flex gap-2 pt-1">
                {onEdit && (
                  <Button size="sm" variant="outline" onClick={() => onEdit(l)} className="h-7 text-xs">
                    <Pencil className="mr-1 h-3 w-3" /> Edit
                  </Button>
                )}
                {onDelete && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="outline" className="h-7 text-xs text-destructive border-destructive/30 hover:bg-destructive/10">
                        <Trash2 className="mr-1 h-3 w-3" /> Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Lead?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to permanently delete <strong>{l.name}</strong>'s lead? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          onClick={() => onDelete(l)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Desktop table view */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead>Name</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Service</TableHead>
              <TableHead className="text-right">Budget</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              {showActions && <TableHead className="w-24 text-center">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((l) => (
              <TableRow key={l.id} className="hover:bg-accent/40">
                <TableCell className="font-medium">{l.name}</TableCell>
                <TableCell className="text-muted-foreground">{l.mobile}</TableCell>
                <TableCell className="text-muted-foreground">{l.email}</TableCell>
                <TableCell>{l.city}</TableCell>
                <TableCell>{l.service}</TableCell>
                <TableCell className="text-right tabular-nums">₹{l.budget.toLocaleString("en-IN")}</TableCell>
                <TableCell>
                  <StatusBadge status={l.status} />
                </TableCell>
                <TableCell className="text-muted-foreground">{format(new Date(l.createdAt), "dd MMM yyyy")}</TableCell>
                {showActions && (
                  <TableCell>
                    <div className="flex items-center gap-1 justify-center">
                      {onEdit && (
                        <Button size="icon" variant="ghost" onClick={() => onEdit(l)} aria-label="Edit lead">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                      {onDelete && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive" aria-label="Delete lead">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Lead?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to permanently delete <strong>{l.name}</strong>'s lead? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                onClick={() => onDelete(l)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
