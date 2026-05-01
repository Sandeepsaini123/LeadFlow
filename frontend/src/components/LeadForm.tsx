import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { META } from "@/services/api";

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  mobile: z
    .string()
    .trim()
    .min(1, "Mobile number is required")
    .regex(/^[0-9+\-\s]{7,15}$/, "Enter a valid mobile number (7-15 digits)"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address")
    .max(255),
  city: z.string().min(1, "Please select a city"),
  service: z.string().min(1, "Please select a service"),
  budget: z.coerce
    .number({ invalid_type_error: "Budget is required" })
    .min(1, "Budget must be greater than 0"),
  status: z.enum(["New", "Interested", "Converted", "Rejected"], {
    errorMap: () => ({ message: "Please select a status" }),
  }),
});

export type LeadFormValues = z.infer<typeof schema>;

interface Props {
  defaultValues?: Partial<LeadFormValues>;
  onSubmit: (values: LeadFormValues) => Promise<void> | void;
  submitting?: boolean;
  onCancel?: () => void;
}

export function LeadForm({ defaultValues, onSubmit, submitting, onCancel }: Props) {
  const form = useForm<LeadFormValues>({
    resolver: zodResolver(schema),
    mode: "onTouched", // field se bahar jaate hi validate karo
    defaultValues: {
      name: "",
      mobile: "",
      email: "",
      city: "",
      service: "",
      budget: undefined,
      status: "New",
      ...defaultValues,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = form;

  const city = watch("city");
  const service = watch("service");
  const status = watch("status");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 grid-cols-1 sm:grid-cols-2" noValidate>
      <Field label="Name" error={errors.name?.message} required>
        <Input
          {...register("name")}
          placeholder="e.g. Rahul Sharma"
          className={errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
        />
      </Field>

      <Field label="Mobile" error={errors.mobile?.message} required>
        <Input
          {...register("mobile")}
          placeholder="e.g. 9876543210"
          className={errors.mobile ? "border-destructive focus-visible:ring-destructive" : ""}
        />
      </Field>

      <Field label="Email" error={errors.email?.message} className="sm:col-span-2" required>
        <Input
          type="email"
          {...register("email")}
          placeholder="e.g. rahul@example.com"
          className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
        />
      </Field>

      <Field label="City" error={errors.city?.message} required>
        <Select value={city} onValueChange={(v) => setValue("city", v, { shouldValidate: true })}>
          <SelectTrigger
            className={errors.city ? "border-destructive focus-visible:ring-destructive" : ""}
          >
            <SelectValue placeholder="Select city…" />
          </SelectTrigger>
          <SelectContent>
            {META.CITIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field label="Service" error={errors.service?.message} required>
        <Select
          value={service}
          onValueChange={(v) => setValue("service", v, { shouldValidate: true })}
        >
          <SelectTrigger
            className={errors.service ? "border-destructive focus-visible:ring-destructive" : ""}
          >
            <SelectValue placeholder="Select service…" />
          </SelectTrigger>
          <SelectContent>
            {META.SERVICES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field label="Budget (₹)" error={errors.budget?.message} required>
        <Input
          type="number"
          {...register("budget")}
          placeholder="e.g. 50000"
          min={1}
          className={errors.budget ? "border-destructive focus-visible:ring-destructive" : ""}
        />
      </Field>

      <Field label="Status" error={errors.status?.message} required>
        <Select
          value={status}
          onValueChange={(v) =>
            setValue("status", v as LeadFormValues["status"], { shouldValidate: true })
          }
        >
          <SelectTrigger
            className={errors.status ? "border-destructive focus-visible:ring-destructive" : ""}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {META.STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <div className="flex justify-end gap-2 sm:col-span-2 pt-2">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving…" : "Save Lead"}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  children,
  className,
  required,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
  required?: boolean;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className ?? ""}`}>
      <Label className="text-xs font-medium text-muted-foreground">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </Label>
      {children}
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  );
}
