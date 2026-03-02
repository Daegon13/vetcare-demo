import type { Appointment, Campaign, PetProfile, TriageCase } from "./types";

function asDateISO(base: Date, offsetDays: number) {
  const d = new Date(base);
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

function asDateTimeISO(base: Date, offsetHours: number) {
  const d = new Date(base.getTime() + offsetHours * 60 * 60 * 1000);
  return d.toISOString();
}

export function buildDemoSeed() {
  const now = new Date();

  const appointments: Appointment[] = [
    {
      id: "ap_seed_1",
      createdAt: asDateTimeISO(now, -18),
      dateISO: asDateISO(now, 0),
      time: "10:00",
      serviceId: "consulta",
      petName: "Luna",
      ownerName: "Sofía Méndez",
      phone: "+598 99 123 456",
      notes: "Control anual.",
      status: "confirmado"
    },
    {
      id: "ap_seed_2",
      createdAt: asDateTimeISO(now, -16),
      dateISO: asDateISO(now, 0),
      time: "11:30",
      serviceId: "vacunacion",
      petName: "Milo",
      ownerName: "Martín Pérez",
      phone: "+598 98 555 221",
      notes: "Refuerzo polivalente.",
      status: "pendiente"
    },
    {
      id: "ap_seed_3",
      createdAt: asDateTimeISO(now, -8),
      dateISO: asDateISO(now, 1),
      time: "09:30",
      serviceId: "desparasitacion",
      petName: "Nala",
      ownerName: "Camila Rodríguez",
      phone: "+598 94 332 100",
      status: "pendiente"
    },
    {
      id: "ap_seed_4",
      createdAt: asDateTimeISO(now, -4),
      dateISO: asDateISO(now, 1),
      time: "16:00",
      serviceId: "control",
      petName: "Toby",
      ownerName: "Andrés Silva",
      phone: "+598 91 888 900",
      notes: "Seguimiento dermatológico.",
      status: "confirmado"
    },
    {
      id: "ap_seed_5",
      createdAt: asDateTimeISO(now, -2),
      dateISO: asDateISO(now, 2),
      time: "14:30",
      serviceId: "estetica",
      petName: "Kiara",
      ownerName: "Lucía Torres",
      phone: "+598 92 741 852",
      status: "pendiente"
    }
  ];

  const triage: TriageCase[] = [
    {
      id: "tr_seed_1",
      createdAt: asDateTimeISO(now, -3),
      petName: "Rocky",
      species: "Perro",
      ownerName: "Diego Alonso",
      phone: "+598 99 800 121",
      symptoms: ["vómitos", "apatía"],
      freeText: "No quiere comer desde ayer.",
      priority: "media",
      recommendedAction: "Traer hoy para evaluación clínica y control de hidratación."
    },
    {
      id: "tr_seed_2",
      createdAt: asDateTimeISO(now, -1),
      petName: "Misha",
      species: "Gato",
      ownerName: "Valentina Cabrera",
      phone: "+598 95 777 220",
      symptoms: ["dificultad respiratoria", "tos"],
      freeText: "Respira rápido y está escondida.",
      priority: "alta",
      recommendedAction: "Acudir de inmediato a urgencias para estabilización."
    },
    {
      id: "tr_seed_3",
      createdAt: asDateTimeISO(now, -0.5),
      petName: "Pipa",
      species: "Perro",
      ownerName: "Gabriela Núñez",
      phone: "+598 97 314 990",
      symptoms: ["cojera"],
      freeText: "Se golpeó jugando en el parque.",
      priority: "baja",
      recommendedAction: "Reposo, frío local y consulta de control en las próximas 24 h."
    }
  ];

  const pet: PetProfile = {
    id: "pet_seed_1",
    petName: "Milo",
    species: "Perro",
    breed: "Mestizo",
    birthYear: 2021,
    weightKg: 14.2,
    allergies: "Sensibilidad leve a pulgas.",
    vaccines: [
      {
        id: "vac_seed_1",
        name: "Antirrábica",
        dateISO: asDateISO(now, -320),
        nextDueISO: asDateISO(now, 45)
      },
      {
        id: "vac_seed_2",
        name: "Polivalente",
        dateISO: asDateISO(now, -190),
        nextDueISO: asDateISO(now, 18)
      },
      {
        id: "vac_seed_3",
        name: "Bordetella",
        dateISO: asDateISO(now, -30),
        nextDueISO: asDateISO(now, 335)
      }
    ]
  };

  const campaigns: Campaign[] = [
    {
      id: "camp_seed_1",
      title: "Recordatorio vacunas de otoño",
      audience: "Clientes",
      channel: "WhatsApp",
      message: "Hola 👋 Tenemos cupos esta semana para refuerzos y control preventivo.",
      scheduledISO: asDateTimeISO(now, 24),
      status: "programada"
    },
    {
      id: "camp_seed_2",
      title: "Chequeo senior + análisis",
      audience: "Prospectos",
      channel: "Instagram",
      message: "En mayo priorizá prevención: chequeo geriátrico con agenda flexible.",
      scheduledISO: asDateTimeISO(now, 72),
      status: "borrador"
    }
  ];

  return { appointments, triage, pet, campaigns };
}
