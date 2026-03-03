import type { Appointment, Campaign, PetProfile, TriageCase } from "./types";
import { DEFAULT_CAMPAIGNS, DEFAULT_PET } from "./data";
import { buildDemoSeed } from "./demoSeed";

const KEY = {
  appts: "vetcare.appts.v1",
  triage: "vetcare.triage.v1",
  pet: "vetcare.pet.v1",
  campaigns: "vetcare.campaigns.v1",
  seeded: "vetcare.seeded.v1"
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

export function ensureDemoSeed() {
  if (!hasStorage()) return;

  try {
    const demo = buildDemoSeed();
    const alreadySeeded = safeGetRaw(KEY.seeded) === "1";

    const hasAppts = safeGetRaw(KEY.appts) !== null;
    const hasTriage = safeGetRaw(KEY.triage) !== null;
    const hasPet = safeGetRaw(KEY.pet) !== null;
    const hasCampaigns = safeGetRaw(KEY.campaigns) !== null;

    const allMissing = !hasAppts && !hasTriage && !hasPet && !hasCampaigns;

    if (!alreadySeeded && allMissing) {
      safeSet(KEY.appts, demo.appointments);
      safeSet(KEY.triage, demo.triage);
      safeSet(KEY.pet, demo.pet);
      safeSet(KEY.campaigns, demo.campaigns);
      setSeededFlag();
      return;
    }

    if (alreadySeeded) {
      if (!hasAppts) safeSet(KEY.appts, demo.appointments);
      if (!hasTriage) safeSet(KEY.triage, demo.triage);
      if (!hasPet) safeSet(KEY.pet, demo.pet);
      if (!hasCampaigns) safeSet(KEY.campaigns, demo.campaigns);
      setSeededFlag();
    }
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
    safeSet(KEY.appts, demo.appointments);
    safeSet(KEY.triage, demo.triage);
    safeSet(KEY.pet, demo.pet);
    safeSet(KEY.campaigns, demo.campaigns);
    setSeededFlag();
  } catch {
    // noop
  }
}

export function restoreDemoData() {
  if (!hasStorage()) return;
  resetDemo();
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
