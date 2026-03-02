import type { Appointment, Campaign, PetProfile, TriageCase } from "./types";
import { DEFAULT_CAMPAIGNS, DEFAULT_PET } from "./data";
import { buildDemoSeed } from "./demoSeed";

const KEY = {
  appts: "vetcare.appts.v1",
  triage: "vetcare.triage.v1",
  pet: "vetcare.pet.v1",
  campaigns: "vetcare.campaigns.v1",
  seeded: "vetcare.seeded.v1"
} as const;

function isBrowser() {
  return typeof window !== "undefined";
}

function safeParse<T>(raw: string | null, fallback: T): T {
  try {
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeGet(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function safeSet(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // ignore
  }
}
function safeRemove(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export function loadAppointments(): Appointment[] {
  if (!isBrowser()) return [];
  ensureDemoSeed();
  return safeParse(safeGet(KEY.appts), []);
}
export function saveAppointments(items: Appointment[]) {
  safeSet(KEY.appts, JSON.stringify(items));
}

export function loadTriage(): TriageCase[] {
  if (!isBrowser()) return [];
  ensureDemoSeed();
  return safeParse(safeGet(KEY.triage), []);
}
export function saveTriage(items: TriageCase[]) {
  safeSet(KEY.triage, JSON.stringify(items));
}

export function loadPet(): PetProfile {
  if (!isBrowser()) return DEFAULT_PET;
  ensureDemoSeed();
  return safeParse(safeGet(KEY.pet), DEFAULT_PET);
}
export function savePet(p: PetProfile) {
  safeSet(KEY.pet, JSON.stringify(p));
}

export function loadCampaigns(): Campaign[] {
  if (!isBrowser()) return DEFAULT_CAMPAIGNS;
  ensureDemoSeed();
  return safeParse(safeGet(KEY.campaigns), DEFAULT_CAMPAIGNS);
}
export function saveCampaigns(items: Campaign[]) {
  safeSet(KEY.campaigns, JSON.stringify(items));
}

/**
 * Ensures the demo is not "empty" on first visit.
 * - Runs only once per browser (flag KEY.seeded).
 * - Does NOT overwrite user-created demo data.
 */
export function ensureDemoSeed() {
  if (!isBrowser()) return;
  if (safeGet(KEY.seeded) === "1") return;
  seedDemo({ overwrite: false });
}

/**
 * Seeds demo data.
 * - overwrite=false: only fills missing keys (safe for first visit)
 * - overwrite=true: resets all demo data to a fresh, "alive" state
 */
export function seedDemo({ overwrite }: { overwrite: boolean }) {
  if (!isBrowser()) return;

  const seed = buildDemoSeed(new Date());

  const hasAppts = !!safeGet(KEY.appts);
  const hasTriage = !!safeGet(KEY.triage);
  const hasPet = !!safeGet(KEY.pet);
  const hasCampaigns = !!safeGet(KEY.campaigns);

  if (overwrite || !hasAppts) safeSet(KEY.appts, JSON.stringify(seed.appts));
  if (overwrite || !hasTriage) safeSet(KEY.triage, JSON.stringify(seed.triage));
  if (overwrite || !hasPet) safeSet(KEY.pet, JSON.stringify(seed.pet));
  if (overwrite || !hasCampaigns) safeSet(KEY.campaigns, JSON.stringify(seed.campaigns));

  safeSet(KEY.seeded, "1");
}

/**
 * Public action exposed to the UI.
 * Resets the demo to a fresh seeded state (not "empty").
 */
export function resetDemo() {
  seedDemo({ overwrite: true });
}

/**
 * Full clear (useful for debugging). Not used in the UI by default.
 */
export function clearDemo() {
  if (!isBrowser()) return;
  safeRemove(KEY.appts);
  safeRemove(KEY.triage);
  safeRemove(KEY.pet);
  safeRemove(KEY.campaigns);
  safeRemove(KEY.seeded);
}
