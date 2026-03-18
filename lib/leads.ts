import type { UTMData } from "@/lib/utm";

export type LeadChannel = "whatsapp_click" | "thank_you";

export type LeadEvent = {
  id: string;
  createdAtISO: string;
  sourcePage: string;
  utm?: UTMData;
  interest?: string[];
  channel: LeadChannel | string;
  note?: string;
  phone?: string;
  petName?: string;
  serviceId?: string;
};

type LeadEventInput = Omit<LeadEvent, "id" | "createdAtISO"> & {
  id?: string;
  leadId?: string;
  createdAtISO?: string;
};

export const LEADS_STORAGE_KEY = "vetcare:leads";

function hasStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function safeParse(raw: string | null): LeadEvent[] {
  if (!raw) return [];
  try {
    const data = JSON.parse(raw) as LeadEvent[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function uid(prefix = "lead") {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
}

export function getLeads(): LeadEvent[] {
  if (!hasStorage()) return [];
  try {
    return safeParse(localStorage.getItem(LEADS_STORAGE_KEY));
  } catch {
    return [];
  }
}

export function addLead(lead: LeadEventInput): LeadEvent {
  const id = lead.leadId ? `${lead.leadId}:${lead.channel}` : (lead.id ?? uid());
  const nextLead: LeadEvent = {
    ...lead,
    id,
    createdAtISO: lead.createdAtISO ?? new Date().toISOString()
  };

  if (!hasStorage()) return nextLead;

  try {
    const current = getLeads();
    const existing = current.find((item) => item.id === id);
    if (existing) return existing;

    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify([nextLead, ...current]));
  } catch {
    // noop
  }

  return nextLead;
}

export function clearLeads() {
  if (!hasStorage()) return;
  try {
    localStorage.removeItem(LEADS_STORAGE_KEY);
  } catch {
    // noop
  }
}

function escapeCsv(value: string) {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function exportLeadsCSV(): string {
  const leads = getLeads();
  const headers = ["id", "createdAtISO", "sourcePage", "channel", "interest", "utm_campaign", "note", "phone", "petName", "serviceId"];
  const rows = leads.map((lead) => [
    lead.id,
    lead.createdAtISO,
    lead.sourcePage,
    lead.channel,
    (lead.interest ?? []).join("|"),
    lead.utm?.utm_campaign ?? "",
    lead.note ?? "",
    lead.phone ?? "",
    lead.petName ?? "",
    lead.serviceId ?? ""
  ]);

  return [headers, ...rows]
    .map((row) => row.map((value) => escapeCsv(String(value))).join(","))
    .join("\n");
}

export function exportLeadsJSON(): string {
  return JSON.stringify(getLeads(), null, 2);
}


export function saveLeads(items: LeadEvent[]) {
  if (!hasStorage()) return;
  try {
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // noop
  }
}
