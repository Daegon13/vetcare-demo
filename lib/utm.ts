export type UTMData = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  ref?: string;
  landing_path?: string;
  captured_at?: string;
};

export type LeadInterest = "turnos" | "urgencias" | "portal" | "admin";

export type LeadPayload = {
  nombre: string;
  clinica: string;
  ciudad: string;
  whatsapp: string;
  plan: string;
  interes: LeadInterest[];
};

const UTM_STORAGE_KEY = "vetcare:utm";
const UTM_KEYS: Array<keyof UTMData> = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "ref"];

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function withFallbackBase(url: string) {
  return new URL(url, "http://localhost");
}

export function captureUtmFromUrl(searchParams: URLSearchParams) {
  if (!canUseStorage()) return;

  const incoming: UTMData = {};
  for (const key of UTM_KEYS) {
    const value = searchParams.get(key);
    if (value) incoming[key] = value;
  }

  if (!Object.keys(incoming).length) return;

  const existing = getStoredUtm() ?? {};
  const next: UTMData = {
    ...existing,
    ...incoming,
    landing_path: existing.landing_path ?? window.location.pathname,
    captured_at: existing.captured_at ?? new Date().toISOString()
  };

  try {
    localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // noop
  }
}

export function getStoredUtm(): UTMData | null {
  if (!canUseStorage()) return null;
  try {
    const raw = localStorage.getItem(UTM_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UTMData;
  } catch {
    return null;
  }
}

export function appendUtmToUrl(url: string, utm: UTMData | null): string {
  if (!utm) return url;

  let parsed: URL;
  try {
    parsed = withFallbackBase(url);
  } catch {
    return url;
  }

  if (parsed.hostname === "forms.gle") {
    return url;
  }

  for (const key of UTM_KEYS) {
    const value = utm[key];
    if (value) {
      parsed.searchParams.set(key, value);
    }
  }

  if (utm.ref) parsed.searchParams.set("ref", utm.ref);

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return parsed.toString();
  }

  return `${parsed.pathname}${parsed.search}${parsed.hash}`;
}

export function buildWhatsappUrl(baseWhatsappUrl: string, utm: UTMData | null, extraMessage?: string): string {
  let parsed: URL;
  try {
    parsed = withFallbackBase(baseWhatsappUrl);
  } catch {
    return baseWhatsappUrl;
  }

  const baseText = parsed.searchParams.get("text") ?? "Hola, vengo por la demo VetCare.";
  const details = [extraMessage]
    .filter(Boolean)
    .join(" ")
    .trim();

  const utmChunks: string[] = [];
  if (utm?.utm_campaign) utmChunks.push(`utm_campaign=${utm.utm_campaign}`);
  if (utm?.utm_source) utmChunks.push(`utm_source=${utm.utm_source}`);
  if (utm?.utm_medium) utmChunks.push(`utm_medium=${utm.utm_medium}`);
  if (utm?.ref) utmChunks.push(`ref=${utm.ref}`);

  const utmBlock = utmChunks.length ? ` (${utmChunks.join(", ")})` : "";
  const fullText = `${baseText}${details ? ` ${details}` : ""}${utmBlock}`;
  parsed.searchParams.set("text", fullText);

  if (baseWhatsappUrl.startsWith("http://") || baseWhatsappUrl.startsWith("https://")) {
    return parsed.toString();
  }

  return `${parsed.pathname}${parsed.search}${parsed.hash}`;
}

export function buildLeadWhatsappUrl(baseWhatsappUrl: string, utm: UTMData | null, lead: LeadPayload): string {
  const interest = lead.interes.join("/") || "sin especificar";
  const chunks = [
    `Plan: ${lead.plan}`,
    `Clínica: ${lead.clinica} / Ciudad: ${lead.ciudad}`,
    `Interés: ${interest}`,
    lead.nombre ? `Nombre: ${lead.nombre}` : "",
    lead.whatsapp ? `WhatsApp: ${lead.whatsapp}` : ""
  ].filter(Boolean);

  const utmChunks: string[] = [];
  if (utm?.utm_campaign) utmChunks.push(`utm_campaign=${utm.utm_campaign}`);
  if (utm?.utm_source) utmChunks.push(`utm_source=${utm.utm_source}`);
  if (utm?.utm_medium) utmChunks.push(`utm_medium=${utm.utm_medium}`);
  if (utm?.ref) utmChunks.push(`ref=${utm.ref}`);

  if (utmChunks.length) {
    chunks.push(`UTM: ${utmChunks.join(", ")}`);
  }

  return buildWhatsappUrl(baseWhatsappUrl, null, chunks.join("\n"));
}
