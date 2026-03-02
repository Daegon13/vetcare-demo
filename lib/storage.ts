import type { Appointment, Campaign, PetProfile, TriageCase } from "./types";
import { DEFAULT_CAMPAIGNS, DEFAULT_PET } from "./data";
import { buildDemoSeed } from "./demoSeed";

const KEY = {
  appts: "vetcare.appts.v1",
  triage: "vetcare.triage.v1",
  pet: "vetcare.pet.v1",
  campaigns: "vetcare.campaigns.v1",
  seeded: "vetcare.seeded.v1",
} as const;

function hasStorage() {
  try {
    return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
  } catch {
    return false;
  }
}

function safeParse<T>(raw: string | null, fallback: T): T {
  try {
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** JSON-safe read (SSR-safe + storage-block-safe) */
export function safeGet<T>(key: string, fallback: T): T {
  if (!hasStorage()) return fallback;
  try {
    return safeParse(localStorage.getItem(key), fallback);
  } catch {
    return fallback;
  }
}

/** JSON-safe write (SSR-safe + storage-block-safe) */
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

function safeSetRaw(key: string, value: string) {
  if (!hasStorage()) return;
  try {
    localStorage.setItem(key, value);
  } catch {
    // noop
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
  safeSetRaw(KEY.seeded, "1");
}

/**
 * Ensures the demo is not "empty" on first visit.
 * - Seeds ONLY if all demo keys are missing and not seeded yet.
 * - If already seeded, backfills any missing key (won't overwrite existing data).
 */
export function ensureDemoSeed() {
  if (!hasStorage()) return;

  try {
    const alreadySeeded = safeGetRaw(KEY.seeded) === "1";

    const hasAppts = safeGetRaw(KEY.appts) !== null;
    const hasTriage = safeGetRaw(KEY.triage) !== null;
    const hasPet = safeGetRaw(KEY.pet) !== null;
    const hasCampaigns = safeGetRaw(KEY.campaigns) !== null;

    const allMissing = !hasAppts && !hasTriage && !hasPet && !hasCampaigns;

    // First-visit seed: only if storage is truly empty (matches patch notes intent)
    const shouldInitialSeed = !alreadySeeded && allMissing;

    // Backfill: only if we know we seeded at least once in this browser
    const shouldBackfill = alreadySeeded;

    if (!shouldInitialSeed && !shouldBackfill) return;

    const seed = buildDemoSeed(new Date());

    if (shouldInitialSeed) {
      safeSet(KEY.appts, seed.appts);
      safeSet(KEY.triage, seed.triage);
      safeSet(KEY.pet, seed.pet);
      safeSet(KEY.campaigns, seed.campaigns);
      setSeededFlag();
      return;
    }

    // alreadySeeded backfill: fill ONLY missing keys
    if (!hasAppts) safeSet(KEY.appts, seed.appts);
    if (!hasTriage) safeSet(KEY.triage, seed.triage);
    if (!hasPet) safeSet(KEY.pet, seed.pet);
    if (!hasCampaigns) safeSet(KEY.campaigns, seed.campaigns);

    setSeededFlag();
  } catch {
    // noop
  }
}

/** Full clear (debug). Not used in UI by default. */
export function clearDemo() {
  if (!hasStorage()) return;
  try {
    safeRemove(KEY.appts);
    safeRemove(KEY.triage);
    safeRemove(KEY.pet);
    safeRemove(KEY.campaigns);
    safeRemove(KEY.seeded);
  } catch {
    // noop
  }
}

/** Public action exposed to the UI: resets to a fresh seeded state (not empty). */
export function resetDemo() {
  if (!hasStorage()) return;
  try {
    clearDemo();
    const seed = buildDemoSeed(new Date());
    safeSet(KEY.appts, seed.appts);
    safeSet(KEY.triage, seed.triage);
    safeSet(KEY.pet, seed.pet);
    safeSet(KEY.campaigns, seed.campaigns);
    setSeededFlag();
  } catch {
    // noop
  }
}

export function loadAppointments(): Appointment[] {
  ensureDemoSeed();
  return safeGet(KEY.appts, []);
}

export function saveAppointments(items: Appointment[]) {
  safeSet(KEY.appts, items);
}

export function loadTriage(): TriageCase[] {
  ensureDemoSeed();
  return safeGet(KEY.triage, []);
}

export function saveTriage(items: TriageCase[]) {
  safeSet(KEY.triage, items);
}

export function loadPet(): PetProfile {
  ensureDemoSeed();
  return safeGet(KEY.pet, DEFAULT_PET);
}

export function savePet(p: PetProfile) {
  safeSet(KEY.pet, p);
}

export function loadCampaigns(): Campaign[] {
  ensureDemoSeed();
  return safeGet(KEY.campaigns, DEFAULT_CAMPAIGNS);
}

export function saveCampaigns(items: Campaign[]) {
  safeSet(KEY.campaigns, items);
}