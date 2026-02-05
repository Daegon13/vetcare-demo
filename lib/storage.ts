import type { Appointment, Campaign, PetProfile, TriageCase } from "./types";
import { DEFAULT_CAMPAIGNS, DEFAULT_PET } from "./data";

const KEY = {
  appts: "vetcare.appts.v1",
  triage: "vetcare.triage.v1",
  pet: "vetcare.pet.v1",
  campaigns: "vetcare.campaigns.v1"
};

function safeParse<T>(raw: string | null, fallback: T): T {
  try {
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function loadAppointments(): Appointment[] {
  if (typeof window === "undefined") return [];
  return safeParse(localStorage.getItem(KEY.appts), []);
}
export function saveAppointments(items: Appointment[]) {
  localStorage.setItem(KEY.appts, JSON.stringify(items));
}

export function loadTriage(): TriageCase[] {
  if (typeof window === "undefined") return [];
  return safeParse(localStorage.getItem(KEY.triage), []);
}
export function saveTriage(items: TriageCase[]) {
  localStorage.setItem(KEY.triage, JSON.stringify(items));
}

export function loadPet(): PetProfile {
  if (typeof window === "undefined") return DEFAULT_PET;
  return safeParse(localStorage.getItem(KEY.pet), DEFAULT_PET);
}
export function savePet(p: PetProfile) {
  localStorage.setItem(KEY.pet, JSON.stringify(p));
}

export function loadCampaigns(): Campaign[] {
  if (typeof window === "undefined") return DEFAULT_CAMPAIGNS;
  return safeParse(localStorage.getItem(KEY.campaigns), DEFAULT_CAMPAIGNS);
}
export function saveCampaigns(items: Campaign[]) {
  localStorage.setItem(KEY.campaigns, JSON.stringify(items));
}

export function resetDemo() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY.appts);
  localStorage.removeItem(KEY.triage);
  localStorage.removeItem(KEY.pet);
  localStorage.removeItem(KEY.campaigns);
}
