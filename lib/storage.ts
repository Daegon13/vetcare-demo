import type { Appointment, Campaign, PetProfile, TriageCase } from "./types";
import { DEFAULT_CAMPAIGNS, DEFAULT_PET } from "./data";
import { buildDemoSeed } from "./demoSeed";
import { clearLeads, getLeads, LEADS_STORAGE_KEY, saveLeads, type LeadEvent } from "./leads";

const KEY = {
  appts: "vetcare.appts.v1",
  triage: "vetcare.triage.v1",
  pet: "vetcare.pet.v1",
  campaigns: "vetcare.campaigns.v1",
  seeded: "vetcare.seeded.v2"
};

function safeParse<T>(raw: string | null, fallback: T): T {
  try {
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function hasStorage() {
  try {
    return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
  } catch {
    return false;
  }
}

export function safeGet<T>(key: string, fallback: T): T {
  if (!hasStorage()) return fallback;
  try {
    return safeParse(localStorage.getItem(key), fallback);
  } catch {
    return fallback;
  }
}

export function safeSet<T>(key: string, value: T) {
  if (!hasStorage()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // noop: storage may be blocked/full
  }
}

function safeGetRaw(key: string): string | null {
  if (!hasStorage()) return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeRemove(key: string) {
  if (!hasStorage()) return;
  try {
    localStorage.removeItem(key);
  } catch {
    // noop
  }
}

function setSeededFlag() {
  if (!hasStorage()) return;
  try {
    localStorage.setItem(KEY.seeded, "1");
  } catch {
    // noop
  }
}

function upsertSeedList<T extends { id: string }>(current: T[], seeded: T[]) {
  const currentById = new Map(current.map((item) => [item.id, item]));
  let changed = false;

  for (const item of seeded) {
    if (!currentById.has(item.id)) {
      currentById.set(item.id, item);
      changed = true;
    }
  }

  return {
    items: Array.from(currentById.values()),
    changed
  };
}

function sortAppointments(items: Appointment[]) {
  return items
    .slice()
    .sort((a, b) => `${a.dateISO}${a.time}`.localeCompare(`${b.dateISO}${b.time}`));
}

function sortTriage(items: TriageCase[]) {
  return items
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

function sortCampaigns(items: Campaign[]) {
  return items
    .slice()
    .sort((a, b) => new Date(a.scheduledISO).getTime() - new Date(b.scheduledISO).getTime());
}

function sortLeads(items: LeadEvent[]) {
  return items
    .slice()
    .sort((a, b) => new Date(b.createdAtISO).getTime() - new Date(a.createdAtISO).getTime());
}

function seedCollection<T extends { id: string }>(key: string, seeded: T[], fallback: T[], sortItems?: (items: T[]) => T[]) {
  const current = safeGet<T[]>(key, fallback);
  const { items, changed } = upsertSeedList(current, seeded);
  const finalItems = sortItems ? sortItems(items) : items;

  if (changed || safeGetRaw(key) === null) {
    safeSet(key, finalItems);
  }

  return finalItems;
}

export function ensureDemoSeed() {
  if (!hasStorage()) return;

  try {
    const demo = buildDemoSeed();

    seedCollection(KEY.appts, demo.appointments, [], sortAppointments);
    seedCollection(KEY.triage, demo.triage, [], sortTriage);
    if (safeGetRaw(KEY.pet) === null) safeSet(KEY.pet, demo.pet);
    seedCollection(KEY.campaigns, demo.campaigns, [], sortCampaigns);

    const leadSeed = seedCollection(LEADS_STORAGE_KEY, demo.leads, getLeads(), sortLeads);
    if (leadSeed.length > 0) {
      saveLeads(leadSeed);
    }

    setSeededFlag();
  } catch {
    // noop
  }
}

export function clearDemo() {
  if (!hasStorage()) return;
  try {
    safeRemove(KEY.appts);
    safeRemove(KEY.triage);
    safeRemove(KEY.pet);
    safeRemove(KEY.campaigns);
    clearLeads();
    safeRemove(KEY.seeded);
  } catch {
    // noop
  }
}

export function resetDemo() {
  if (!hasStorage()) return;
  try {
    clearDemo();
    const demo = buildDemoSeed();
    safeSet(KEY.appts, sortAppointments(demo.appointments));
    safeSet(KEY.triage, sortTriage(demo.triage));
    safeSet(KEY.pet, demo.pet);
    safeSet(KEY.campaigns, sortCampaigns(demo.campaigns));
    saveLeads(sortLeads(demo.leads));
    setSeededFlag();
  } catch {
    // noop
  }
}

export function restoreDemoData() {
  if (!hasStorage()) return;
  resetDemo();
}

export function getSeedPreview() {
  return buildDemoSeed();
}

export function loadAppointments(): Appointment[] {
  ensureDemoSeed();
  return safeGet(KEY.appts, getSeedPreview().appointments);
}

export function saveAppointments(items: Appointment[]) {
  safeSet(KEY.appts, items);
}

export function loadTriage(): TriageCase[] {
  ensureDemoSeed();
  return safeGet(KEY.triage, getSeedPreview().triage);
}

export function saveTriage(items: TriageCase[]) {
  safeSet(KEY.triage, items);
}

export function loadPet(): PetProfile {
  ensureDemoSeed();
  return safeGet(KEY.pet, getSeedPreview().pet ?? DEFAULT_PET);
}

export function savePet(p: PetProfile) {
  safeSet(KEY.pet, p);
}

export function loadCampaigns(): Campaign[] {
  ensureDemoSeed();
  return safeGet(KEY.campaigns, getSeedPreview().campaigns ?? DEFAULT_CAMPAIGNS);
}

export function saveCampaigns(items: Campaign[]) {
  safeSet(KEY.campaigns, items);
}
