export type LeadChannel = "whatsapp_click" | "thank_you";

export type LeadChannelEvent = {
  id: string;
  leadId: string;
  channel: LeadChannel;
  createdAt: string;
};

const LEAD_EVENTS_KEY = "vetcare:lead_events";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function safeParse<T>(raw: string | null, fallback: T): T {
  try {
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function normalizeEvents(items: LeadChannelEvent[]): LeadChannelEvent[] {
  return items
    .filter((item) => item && item.id && item.leadId && item.channel && item.createdAt)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function buildLeadEventId(leadId: string, channel: LeadChannel) {
  return `${leadId}:${channel}`;
}

export function loadLeadEvents(): LeadChannelEvent[] {
  if (!canUseStorage()) return [];
  return normalizeEvents(safeParse<LeadChannelEvent[]>(localStorage.getItem(LEAD_EVENTS_KEY), []));
}

export function saveLeadEvents(items: LeadChannelEvent[]) {
  if (!canUseStorage()) return;
  try {
    localStorage.setItem(LEAD_EVENTS_KEY, JSON.stringify(normalizeEvents(items)));
  } catch {
    // noop
  }
}

export function recordLeadEvent(leadId: string, channel: LeadChannel) {
  if (!canUseStorage() || !leadId) return;

  const eventId = buildLeadEventId(leadId, channel);
  const events = loadLeadEvents();
  if (events.some((item) => item.id === eventId)) return;

  const next: LeadChannelEvent[] = [
    {
      id: eventId,
      leadId,
      channel,
      createdAt: new Date().toISOString()
    },
    ...events
  ];

  saveLeadEvents(next);
}

export function createLeadId() {
  const random = Math.random().toString(16).slice(2, 10);
  return `lead_${Date.now().toString(16)}_${random}`;
}
