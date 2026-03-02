import type { Appointment, Campaign, PetProfile, TriageCase } from "./types";
import { DEFAULT_PET } from "./data";

function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

function toISODate(d: Date) {
  // Local date (not UTC) to match <input type="date"> behavior.
  const yyyy = d.getFullYear();
  const mm = pad2(d.getMonth() + 1);
  const dd = pad2(d.getDate());
  return `${yyyy}-${mm}-${dd}`;
}

function addDays(base: Date, days: number) {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

function addMinutes(base: Date, minutes: number) {
  return new Date(base.getTime() + minutes * 60_000);
}

function inDaysISO(now: Date, days: number) {
  return toISODate(addDays(now, days));
}

export function buildDemoSeed(now: Date): {
  appts: Appointment[];
  triage: TriageCase[];
  pet: PetProfile;
  campaigns: Campaign[];
} {
  const today = inDaysISO(now, 0);
  const tomorrow = inDaysISO(now, 1);
  const nextWeek = inDaysISO(now, 7);
  const nextMonth = inDaysISO(now, 25);

  const appts: Appointment[] = [
    {
      id: "ap_seed_1",
      createdAt: addMinutes(now, -90).toISOString(),
      dateISO: today,
      time: "10:00",
      serviceId: "consulta",
      petName: "Milo",
      ownerName: "Sofía",
      phone: "09 123 456",
      notes: "Tos leve hace 2 días",
      status: "confirmado"
    },
    {
      id: "ap_seed_2",
      createdAt: addMinutes(now, -70).toISOString(),
      dateISO: today,
      time: "11:20",
      serviceId: "vacunacion",
      petName: "Luna",
      ownerName: "Carolina",
      phone: "098 555 111",
      notes: "Primera dosis",
      status: "pendiente"
    },
    {
      id: "ap_seed_3",
      createdAt: addMinutes(now, -40).toISOString(),
      dateISO: today,
      time: "15:10",
      serviceId: "estetica",
      petName: "Nala",
      ownerName: "Diego",
      phone: "091 222 333",
      notes: "Piel sensible",
      status: "atendido"
    },
    {
      id: "ap_seed_4",
      createdAt: addMinutes(now, -15).toISOString(),
      dateISO: tomorrow,
      time: "09:30",
      serviceId: "control",
      petName: "Toby",
      ownerName: "Martín",
      phone: "092 777 888",
      notes: "Chequeo preventivo",
      status: "pendiente"
    },
    {
      id: "ap_seed_5",
      createdAt: addMinutes(now, -5).toISOString(),
      dateISO: tomorrow,
      time: "17:00",
      serviceId: "cirugia",
      petName: "Kira",
      ownerName: "Valentina",
      phone: "094 101 202",
      notes: "Re-agendar (demo)",
      status: "cancelado"
    }
  ].sort((a, b) => (a.dateISO + a.time).localeCompare(b.dateISO + b.time));

  const triage: TriageCase[] = [
    {
      id: "tr_seed_1",
      createdAt: addMinutes(now, -22).toISOString(),
      petName: "Milo",
      species: "Perro",
      ownerName: "Sofía",
      phone: "09 123 456",
      symptoms: ["vómitos", "decaimiento", "no come"],
      freeText: "Vomita espuma y está muy quieto.",
      priority: "alta",
      recommendedAction: "Urgencia alta: vení ya o llamanos por WhatsApp para indicaciones inmediatas."
    },
    {
      id: "tr_seed_2",
      createdAt: addMinutes(now, -55).toISOString(),
      petName: "Luna",
      species: "Gato",
      ownerName: "Carolina",
      phone: "098 555 111",
      symptoms: ["cojera", "dolor al tocar"],
      freeText: "Cojea de la pata trasera desde hoy.",
      priority: "media",
      recommendedAction: "Prioridad media: evitá saltos, mantené reposo y coordinemos turno hoy o mañana."
    },
    {
      id: "tr_seed_3",
      createdAt: addMinutes(now, -180).toISOString(),
      petName: "Nala",
      species: "Perro",
      ownerName: "Diego",
      phone: "091 222 333",
      symptoms: ["picazón", "enrojecimiento"],
      freeText: "Se rasca mucho en orejas.",
      priority: "baja",
      recommendedAction: "Prioridad baja: coordinemos control y revisamos alergias/piel."
    }
  ];

  const pet: PetProfile = {
    ...DEFAULT_PET,
    vaccines: [
      // 1 vacuna por vencer (<= 30 días) para que se vea el badge.
      { id: "v_seed_1", name: "Antirrábica", dateISO: nextWeek, nextDueISO: nextMonth },
      { id: "v_seed_2", name: "Polivalente", dateISO: inDaysISO(now, -10), nextDueISO: inDaysISO(now, 320) }
    ]
  };

  const campaigns: Campaign[] = [
    {
      id: "c_seed_1",
      title: "Vacunación antirrábica -10% (semana)",
      audience: "Clientes",
      channel: "WhatsApp",
      message: "Hola! Esta semana tenemos antirrábica con -10%. ¿Querés que te pase horarios disponibles para tu mascota?",
      scheduledISO: addDays(now, 2).toISOString(),
      status: "programada"
    },
    {
      id: "c_seed_2",
      title: "Control preventivo",
      audience: "Prospectos",
      channel: "Instagram",
      message: "Vacunas al día + control preventivo = tranquilidad. Escribinos y te armamos el esquema según edad y especie.",
      scheduledISO: addDays(now, 5).toISOString(),
      status: "borrador"
    }
  ];

  return { appts, triage, pet, campaigns };
}
