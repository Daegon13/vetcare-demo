import { SERVICES } from "./data";
import type { Appointment, ServiceId } from "./types";

export type Slot = { time: string; isAvailable: boolean; reason?: string };

function toMin(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}
function fromMin(min: number) {
  const h = Math.floor(min / 60).toString().padStart(2, "0");
  const m = (min % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

export function getService(serviceId: ServiceId) {
  const s = SERVICES.find(x => x.id === serviceId);
  if (!s) throw new Error("Servicio inválido");
  return s;
}

export function buildDailySlots(
  dateISO: string,
  serviceId: ServiceId,
  existing: Appointment[]
): Slot[] {
  const { durationMin, bufferMin } = getService(serviceId);
  const open = toMin("09:00");
  const close = toMin("19:00");
  const step = 10;

  const knows = existing
    .filter(a => a.dateISO === dateISO && a.status !== "cancelado")
    .map(a => {
      const s = getService(a.serviceId);
      const start = toMin(a.time);
      const end = start + s.durationMin + s.bufferMin;
      return { start, end };
    });

  const slots: Slot[] = [];
  for (let t = open; t + durationMin <= close; t += step) {
    const end = t + durationMin + bufferMin;
    const clash = knows.find(b => !(end <= b.start || t >= b.end));
    if (clash) slots.push({ time: fromMin(t), isAvailable: false, reason: "Ocupado" });
    else slots.push({ time: fromMin(t), isAvailable: true });
  }
  return slots;
}

export function makeICS({
  title,
  dateISO,
  time,
  minutes,
  description,
  location
}: {
  title: string;
  dateISO: string;
  time: string;
  minutes: number;
  description: string;
  location: string;
}) {
  const start = new Date(`${dateISO}T${time}:00`);
  const end = new Date(start.getTime() + minutes * 60000);

  const pad = (n: number) => n.toString().padStart(2, "0");
  const fmt = (d: Date) =>
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;

  const uid = `${Math.random().toString(16).slice(2)}@vetcare-demo`;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//VetCare//Demo//ES",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${escapeICS(title)}`,
    `DESCRIPTION:${escapeICS(description)}`,
    `LOCATION:${escapeICS(location)}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ];
  return lines.join("\r\n");
}

function escapeICS(v: string) {
  return v.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}
