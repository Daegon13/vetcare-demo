import type { Campaign, PetProfile, ServiceId } from "./types";

export const BRAND = {
  name: "VetCare",
  tagline: "Cuidado moderno, rápido y humano.",
  phone: "+598 91 234 567",
  whatsapp: "+59891234567",
  address: "Av. Principal 1234, Montevideo",
  hours: "Lun a Sáb · 9:00–19:00",
};

export const SERVICES: { id: ServiceId; name: string; durationMin: number; bufferMin: number; priceFrom: string; desc: string }[] = [
  { id: "consulta", name: "Consulta general", durationMin: 30, bufferMin: 10, priceFrom: "$ 900", desc: "Revisión clínica, plan de cuidado y seguimiento." },
  { id: "vacunacion", name: "Vacunación", durationMin: 20, bufferMin: 10, priceFrom: "$ 750", desc: "Esquema completo y recordatorios para mantener al día." },
  { id: "desparasitacion", name: "Desparasitación", durationMin: 20, bufferMin: 10, priceFrom: "$ 600", desc: "Interna/externa según especie y peso." },
  { id: "control", name: "Control + chequeo", durationMin: 40, bufferMin: 10, priceFrom: "$ 1200", desc: "Chequeo preventivo con recomendaciones." },
  { id: "cirugia", name: "Cirugía programada", durationMin: 60, bufferMin: 20, priceFrom: "A cotizar", desc: "Evaluación + prequirúrgico + seguimiento." },
  { id: "estetica", name: "Estética / baño", durationMin: 60, bufferMin: 15, priceFrom: "$ 1400", desc: "Baño, corte higiénico y cuidado de piel." }
];

export const DEFAULT_PET: PetProfile = {
  id: "pet_1",
  petName: "Milo",
  species: "Perro",
  breed: "Mestizo",
  birthYear: 2022,
  weightKg: 12.4,
  allergies: "",
  vaccines: [
    { id: "v1", name: "Antirrábica", dateISO: "2025-03-10", nextDueISO: "2026-03-10" },
    { id: "v2", name: "Polivalente", dateISO: "2025-04-02", nextDueISO: "2026-04-02" }
  ]
};

export const DEFAULT_CAMPAIGNS: Campaign[] = [
  {
    id: "c1",
    title: "Campaña Antipulgas",
    audience: "Clientes",
    channel: "WhatsApp",
    message: "Hola! Recordatorio: esta semana tenemos control + antipulgas con descuento. ¿Querés agendar para tu mascota?",
    scheduledISO: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
    status: "programada"
  },
  {
    id: "c2",
    title: "Vacunas al día",
    audience: "Prospectos",
    channel: "Instagram",
    message: "Vacunas al día = tranquilidad. Escribinos y te armamos el esquema según edad y especie.",
    scheduledISO: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(),
    status: "borrador"
  }
];
