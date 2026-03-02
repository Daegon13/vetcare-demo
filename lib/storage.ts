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
  return typeof window !== "undefined";
}

export function safeGet<T>(key: string, fallback: T): T {
  if (!hasStorage()) return fallback;
  return safeParse(localStorage.getItem(key), fallback);
}

export function safeSet<T>(key: string, value: T) {
  if (!hasStorage()) return;
  localStorage.setItem(key, JSON.stringify(value));
}

function isDataStorageEmpty() {
  if (!hasStorage()) return false;
  return !localStorage.getItem(KEY.appts)
    && !localStorage.getItem(KEY.triage)
    && !localStorage.getItem(KEY.pet)
    && !localStorage.getItem(KEY.campaigns);
}

export function ensureDemoSeed() {
  if (!hasStorage()) return;
  const alreadySeeded = localStorage.getItem(KEY.seeded) === "1";
  if (alreadySeeded || !isDataStorageEmpty()) return;

  const demo = buildDemoSeed();
  safeSet(KEY.appts, demo.appointments);
  safeSet(KEY.triage, demo.triage);
  safeSet(KEY.pet, demo.pet);
  safeSet(KEY.campaigns, demo.campaigns);
  localStorage.setItem(KEY.seeded, "1");
}

export function clearDemo() {
  if (!hasStorage()) return;
  localStorage.removeItem(KEY.appts);
  localStorage.removeItem(KEY.triage);
  localStorage.removeItem(KEY.pet);
  localStorage.removeItem(KEY.campaigns);
  localStorage.removeItem(KEY.seeded);
}

export function resetDemo() {
  if (!hasStorage()) return;
  clearDemo();
  const demo = buildDemoSeed();
  safeSet(KEY.appts, demo.appointments);
  safeSet(KEY.triage, demo.triage);
  safeSet(KEY.pet, demo.pet);
  safeSet(KEY.campaigns, demo.campaigns);
  localStorage.setItem(KEY.seeded, "1");
}

export function loadAppointments(): Appointment[] {
  return safeGet(KEY.appts, []);
}

export function saveAppointments(items: Appointment[]) {
  safeSet(KEY.appts, items);
}

export function loadTriage(): TriageCase[] {
  return safeGet(KEY.triage, []);
}

export function saveTriage(items: TriageCase[]) {
  safeSet(KEY.triage, items);
}

export function loadPet(): PetProfile {
  return safeGet(KEY.pet, DEFAULT_PET);
}

export function savePet(p: PetProfile) {
  safeSet(KEY.pet, p);
}

export function loadCampaigns(): Campaign[] {
  return safeGet(KEY.campaigns, DEFAULT_CAMPAIGNS);
}

export function saveCampaigns(items: Campaign[]) {
  safeSet(KEY.campaigns, items);
}
