import type {
  Appointment,
  AppointmentStatus,
  Campaign,
  PetProfile,
  ServiceId,
  TriageCase
} from "./types";

type DemoSeedData = {
  appointments: Appointment[];
  triage: TriageCase[];
  pet: PetProfile;
  campaigns: Campaign[];
};

function asDateISO(base: Date, offsetDays: number) {
  const d = new Date(base);
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

function asDateTimeISO(base: Date, offsetHours: number) {
  const d = new Date(base.getTime() + offsetHours * 60 * 60 * 1000);
  return d.toISOString();
}

function makeAppointment(partial: Omit<Appointment, "serviceId" | "status"> & { serviceId: ServiceId; status: AppointmentStatus }): Appointment {
  return partial;
}

export function buildDemoSeed(): DemoSeedData {
  const now = new Date();

  const appointments: Appointment[] = [
    makeAppointment({
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
    }),
    makeAppointment({
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
    }),
    makeAppointment({
      id: "ap_seed_3",
      createdAt: asDateTimeISO(now, -8),
      dateISO: asDateISO(now, 1),
      time: "09:30",
      serviceId: "desparasitacion",
      petName: "Nala",
      ownerName: "Camila Rodríguez",
      phone: "+598 94 332 100",
      status: "pendiente"
    }),
    makeAppointment({
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
    }),
    makeAppointment({
      id: "ap_seed_5",
      createdAt: asDateTimeISO(now, -2),
      dateISO: asDateISO(now, 2),
      time: "14:30",
      serviceId: "estetica",
      petName: "Kiara",
      ownerName: "Lucía Torres",
      phone: "+598 92 741 852",
      status: "pendiente"
    })
  ];

  const triage: TriageCase[] = [
    {
      id: "tr_seed_1",
      createdAt: asDateTimeISO(now, -0.4),
      petName: "Mora",
      species: "Perro",
      ownerName: "Paula G.",
      phone: "+598 98 412 310",
      symptoms: ["respira", "fiebre"],
      freeText: "Jadea incluso en reposo.",
      priority: "alta",
      recommendedAction: "Atención inmediata: equipo listo para recibirla y estabilizarla al llegar."
    },
    {
      id: "tr_seed_2",
      createdAt: asDateTimeISO(now, -1.5),
      petName: "Simón",
      species: "Gato",
      ownerName: "Mariana R.",
      phone: "+598 94 508 772",
      symptoms: ["vomito", "dolor"],
      freeText: "Vomita desde la madrugada y está molesto.",
      priority: "media",
      recommendedAction: "Consulta en el día para cortar molestias y evitar deshidratación."
    },
    {
      id: "tr_seed_3",
      createdAt: asDateTimeISO(now, -3.2),
      petName: "Nina",
      species: "Perro",
      ownerName: "Federico L.",
      phone: "+598 99 220 145",
      symptoms: ["cojera"],
      freeText: "Apoya menos una pata tras correr.",
      priority: "baja",
      recommendedAction: "Control programado y pautas de cuidado en casa para seguimiento seguro."
    },
    {
      id: "tr_seed_4",
      createdAt: asDateTimeISO(now, -5),
      petName: "Olivia",
      species: "Gato",
      ownerName: "Lucas P.",
      phone: "+598 91 640 903",
      symptoms: ["diarrea", "fiebre"],
      freeText: "Decaída desde ayer.",
      priority: "media",
      recommendedAction: "Evaluación hoy con plan de hidratación y seguimiento por WhatsApp."
    },
    {
      id: "tr_seed_5",
      createdAt: asDateTimeISO(now, -8),
      petName: "Bruno",
      species: "Perro",
      ownerName: "Carla M.",
      phone: "+598 92 601 220",
      symptoms: ["sangrado"],
      freeText: "Corte en la almohadilla con sangrado persistente.",
      priority: "alta",
      recommendedAction: "Ingreso prioritario para controlar sangrado y evaluar sutura si corresponde."
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
