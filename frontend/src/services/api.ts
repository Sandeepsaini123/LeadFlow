import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 15000,
});

export type LeadStatus = "New" | "Interested" | "Converted" | "Rejected";

export interface Lead {
  id: string;
  _id?: string;
  name: string;
  mobile: string;
  email: string;
  city: string;
  service: string;
  budget: number;
  status: LeadStatus;
  createdAt: string;
}

export interface ReportFilters {
  from?: string;
  to?: string;
  city?: string;
  status?: string;
  service?: string;
}

export interface Insight {
  type: string;
  icon: string;
  text: string;
}

export interface InsightsResponse {
  insights: Insight[];
  summary: { total: number; converted: number; conversionRate: string; avgBudget: number };
}

export interface Stats {
  total: number;
  byStatus: { name: string; value: number }[];
  byCity: { name: string; value: number }[];
  byService: { name: string; value: number }[];
}

const STATUSES: LeadStatus[] = ["New", "Interested", "Converted", "Rejected"];
const CITIES = ["Mumbai", "Delhi", "Bangalore", "Pune", "Hyderabad", "Chennai", "Kolkata"];
const SERVICES = ["Web Development", "SEO", "Branding", "Mobile App", "Consulting", "Marketing"];

// Normalize backend lead (_id → id)
const normalize = (lead: Record<string, unknown>): Lead => ({
  ...(lead as unknown as Lead),
  id: (lead._id as string) ?? (lead.id as string),
});

export const leadsApi = {
  async list(): Promise<Lead[]> {
    const { data } = await api.get<Record<string, unknown>[]>("/leads");
    return data.map(normalize);
  },

  async create(payload: Omit<Lead, "id" | "_id" | "createdAt">): Promise<Lead> {
    const { data } = await api.post<Record<string, unknown>>("/leads", payload);
    return normalize(data);
  },

  async update(id: string, payload: Partial<Lead>): Promise<Lead> {
    const { data } = await api.put<Record<string, unknown>>(`/leads/${id}`, payload);
    return normalize(data);
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/leads/${id}`);
  },

  async stats(): Promise<Stats> {
    const { data } = await api.get<{
      total: number;
      statusStats: { _id: string; count: number }[];
      cityStats: { _id: string; count: number }[];
      serviceStats: { _id: string; count: number }[];
    }>("/leads/stats");

    return {
      total: data.total,
      byStatus: data.statusStats.map((s) => ({ name: s._id, value: s.count })),
      byCity: data.cityStats.map((s) => ({ name: s._id, value: s.count })),
      byService: data.serviceStats.map((s) => ({ name: s._id, value: s.count })),
    };
  },

  async insights(): Promise<InsightsResponse> {
    const { data } = await api.get<InsightsResponse>("/leads/insights");
    return data;
  },

  async report(filters: ReportFilters): Promise<Lead[]> {
    const params: Record<string, string> = {};
    if (filters.city && filters.city !== "all") params.city = filters.city;
    if (filters.status && filters.status !== "all") params.status = filters.status;
    if (filters.service && filters.service !== "all") params.service = filters.service;
    if (filters.from) params.startDate = filters.from;
    if (filters.to) params.endDate = filters.to;

    const { data } = await api.get<Record<string, unknown>[]>("/leads/report", { params });
    return data.map(normalize);
  },
};

export const META = { STATUSES, CITIES, SERVICES };
