import type { Campaign, PetProfile, ServiceId } from "./types";
import { clinica, servicios, staff, vacunas, testimonios, faqs } from "@/src/data/vet";

// Capa de compatibilidad para el resto de la aplicación.
// Si querés rebrandear VetCare, cambiá /src/data/vet.ts.

export const BRAND = {
  name: clinica.nombre,
  tagline: clinica.tagline,
  phone: clinica.telefono,
  whatsapp: clinica.whatsapp.replace(/\s/g, ""),
  whatsappUrl: clinica.whatsappUrl,
  implementationCtaLabel: clinica.ctaImplementacionLabel,
  implementationSecondaryCtaLabel: clinica.ctaImplementacionSecundariaLabel,
  implementationCtaUrl: clinica.ctaImplementacionUrl,
  address: clinica.direccion,
  hours: clinica.horarios
};

export const SERVICES: { id: ServiceId; name: string; durationMin: number; bufferMin: number; priceFrom: string; desc: string }[] = servicios.map((s) => ({
  id: s.id,
  name: s.nombre,
  durationMin: s.duracionMin,
  bufferMin: s.bufferMin,
  priceFrom: s.precioDesde,
  desc: s.descripcion
}));

// Export extra (no obligatorio para el flujo actual, pero útil en ventas)
export const STAFF = staff;
export const VACCINES_SCHEMA = vacunas;
export const TESTIMONIALS = testimonios;
export const FAQS = faqs;

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
    title: "Vacunación antirrábica -10% (semana)",
    audience: "Clientes",
    channel: "WhatsApp",
    message:
      "Hola! Esta semana tenemos antirrábica con -10%. ¿Querés que te pase horarios disponibles para tu mascota?",
    scheduledISO: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
    status: "programada"
  },
  {
    id: "c2",
    title: "Control preventivo",
    audience: "Prospectos",
    channel: "Instagram",
    message:
      "Vacunas al día + control preventivo = tranquilidad. Escribinos y te armamos el esquema según edad y especie.",
    scheduledISO: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(),
    status: "borrador"
  }
];
