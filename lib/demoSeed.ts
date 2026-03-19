import type {
  Appointment,
  AppointmentStatus,
  Campaign,
  PetProfile,
  ServiceId,
  TriageCase
} from "./types";
import type { LeadEvent } from "./leads";

type DemoSeedData = {
  appointments: Appointment[];
  triage: TriageCase[];
  pet: PetProfile;
  campaigns: Campaign[];
  leads: LeadEvent[];
};

type SeedReferenceDate = {
  now: Date;
  today: Date;
};

function createReferenceDate(now = new Date()): SeedReferenceDate {
  const today = new Date(now);
  today.setHours(9, 0, 0, 0);
  return { now, today };
}

function asDateISO(base: Date, offsetDays: number) {
  const d = new Date(base);
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

function asDateTimeISO(base: Date, offsetHours: number) {
  const d = new Date(base.getTime() + offsetHours * 60 * 60 * 1000);
  return d.toISOString();
}

function atHour(base: Date, offsetDays: number, hour: number, minute = 0) {
  const d = new Date(base);
  d.setDate(d.getDate() + offsetDays);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

function makeAppointment(partial: Omit<Appointment, "serviceId" | "status"> & { serviceId: ServiceId; status: AppointmentStatus }): Appointment {
  return partial;
}

export function buildDemoSeed(referenceNow = new Date()): DemoSeedData {
  const { now, today } = createReferenceDate(referenceNow);

  const pet: PetProfile = {
    id: "pet_seed_milo",
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
        dateISO: asDateISO(today, -320),
        nextDueISO: asDateISO(today, 45)
      },
      {
        id: "vac_seed_2",
        name: "Polivalente",
        dateISO: asDateISO(today, -190),
        nextDueISO: asDateISO(today, 18)
      },
      {
        id: "vac_seed_3",
        name: "Bordetella",
        dateISO: asDateISO(today, -30),
        nextDueISO: asDateISO(today, 335)
      }
    ]
  };

  const appointments: Appointment[] = [
    makeAppointment({
      id: "ap_seed_1",
      createdAt: atHour(today, -1, 15, 20),
      dateISO: asDateISO(today, 0),
      time: "10:00",
      serviceId: "consulta",
      petName: "Luna",
      ownerName: "Sofía Méndez",
      phone: "+598 99 123 456",
      notes: "Control anual y revisión dental.",
      status: "confirmado"
    }),
    makeAppointment({
      id: "ap_seed_2",
      createdAt: atHour(today, -1, 17, 10),
      dateISO: asDateISO(today, 0),
      time: "11:30",
      serviceId: "vacunacion",
      petName: pet.petName,
      ownerName: "Martín Pérez",
      phone: "+598 98 555 221",
      notes: "Refuerzo polivalente y control de calendario preventivo.",
      status: "confirmado"
    }),
    makeAppointment({
      id: "ap_seed_3",
      createdAt: atHour(today, -1, 18, 30),
      dateISO: asDateISO(today, 1),
      time: "09:30",
      serviceId: "desparasitacion",
      petName: "Nala",
      ownerName: "Camila Rodríguez",
      phone: "+598 94 332 100",
      notes: "Desparasitación previa a guardería.",
      status: "pendiente"
    }),
    makeAppointment({
      id: "ap_seed_4",
      createdAt: atHour(today, -1, 19, 15),
      dateISO: asDateISO(today, 1),
      time: "16:00",
      serviceId: "control",
      petName: "Toby",
      ownerName: "Andrés Silva",
      phone: "+598 91 888 900",
      notes: "Seguimiento dermatológico y ajuste de tratamiento.",
      status: "confirmado"
    }),
    makeAppointment({
      id: "ap_seed_5",
      createdAt: atHour(today, -1, 20, 0),
      dateISO: asDateISO(today, 2),
      time: "14:30",
      serviceId: "estetica",
      petName: "Kiara",
      ownerName: "Lucía Torres",
      phone: "+598 92 741 852",
      notes: "Baño medicado y corte higiénico.",
      status: "pendiente"
    })
  ];

  const triage: TriageCase[] = [
    {
      id: "tr_seed_1",
      createdAt: asDateTimeISO(now, -0.3),
      petName: "Mora",
      species: "Perro",
      ownerName: "Paula G.",
      phone: "+598 98 412 310",
      symptoms: ["respira", "fiebre"],
      freeText: "Jadea incluso en reposo después de una caminata corta y llegó más quieta de lo habitual.",
      priority: "alta",
      recommendedAction: "Atención inmediata: ingreso directo a evaluación, oxigenación y control clínico al llegar."
    },
    {
      id: "tr_seed_2",
      createdAt: asDateTimeISO(now, -1.2),
      petName: "Simón",
      species: "Gato",
      ownerName: "Valentina R.",
      phone: "+598 94 771 240",
      symptoms: ["ojo", "dolor"],
      freeText: "Mantiene un ojo semicerrado desde la mañana y se esconde cuando intentan revisarlo.",
      priority: "media",
      recommendedAction: "Evaluación en el día para revisar dolor ocular y evitar que la lesión avance."
    },
    {
      id: "tr_seed_3",
      createdAt: asDateTimeISO(now, -2.6),
      petName: pet.petName,
      species: pet.species,
      ownerName: "Martín Pérez",
      phone: "+598 98 555 221",
      symptoms: ["vomito", "dolor"],
      freeText: "Vomita desde la madrugada, tomó agua pero sigue incómodo y con abdomen sensible.",
      priority: "media",
      recommendedAction: "Consulta hoy con control de hidratación y manejo del dolor para evitar descompensación."
    },
    {
      id: "tr_seed_4",
      createdAt: asDateTimeISO(now, -4.8),
      petName: "Nina",
      species: "Perro",
      ownerName: "Federico L.",
      phone: "+598 99 220 145",
      symptoms: ["cojera"],
      freeText: "Apoya menos una pata tras correr en la plaza, pero sigue animada y sin llanto intenso.",
      priority: "baja",
      recommendedAction: "Control programado con reposo, frío local y revisión si aparece inflamación o más dolor."
    },
    {
      id: "tr_seed_5",
      createdAt: asDateTimeISO(now, -7.5),
      petName: "Bruno",
      species: "Perro",
      ownerName: "Carla M.",
      phone: "+598 92 601 220",
      symptoms: ["sangrado", "trauma"],
      freeText: "Se cortó una almohadilla al bajar de la camioneta y el sangrado no cede con presión.",
      priority: "alta",
      recommendedAction: "Ingreso prioritario para controlar sangrado, limpiar la herida y definir si requiere sutura."
    }
  ];

  const campaigns: Campaign[] = [
    {
      id: "camp_seed_1",
      title: "Recordatorio vacunas de otoño",
      audience: "Clientes",
      channel: "WhatsApp",
      message: `Hola 👋 Tenemos cupos esta semana para refuerzos y control preventivo. ${pet.petName} tiene su polivalente próxima a vencer.`,
      scheduledISO: asDateTimeISO(now, 24),
      status: "programada"
    },
    {
      id: "camp_seed_2",
      title: "Chequeo senior + análisis",
      audience: "Prospectos",
      channel: "Instagram",
      message: "En mayo priorizá prevención: chequeo geriátrico con agenda flexible y seguimiento por WhatsApp.",
      scheduledISO: asDateTimeISO(now, 72),
      status: "borrador"
    }
  ];

  const leads: LeadEvent[] = [
    {
      id: "lead_seed_1:whatsapp_click",
      createdAtISO: atHour(today, -2, 13, 45),
      sourcePage: "/agenda",
      channel: "whatsapp_click",
      interest: ["turnos", "vacunacion"],
      note: `${pet.petName} consultó por refuerzo y confirmó turno para ${asDateISO(today, 0)} ${appointments[1]?.time}.`,
      phone: "+598 98 555 221",
      petName: pet.petName,
      serviceId: "vacunacion",
      utm: {
        utm_source: "instagram",
        utm_medium: "stories",
        utm_campaign: campaigns[0]?.id,
        utm_content: "recordatorio_vacunas",
        utm_term: "vacunas_otono",
        ref: "seed_demo"
      }
    },
    {
      id: "lead_seed_2:thank_you",
      createdAtISO: atHour(today, -1, 11, 20),
      sourcePage: "/lp",
      channel: "thank_you",
      interest: ["implementacion", "seguimiento"],
      note: "Lead comercial originado desde la landing y atribuido a campaña de demo.",
      phone: "+598 91 640 903",
      petName: "Olivia",
      utm: {
        utm_source: "whatsapp",
        utm_medium: "chat",
        utm_campaign: campaigns[1]?.id,
        utm_content: "lp_demo",
        utm_term: "demo_vetcare",
        ref: "seed_demo"
      }
    }
  ];

  return { appointments, triage, pet, campaigns, leads };
}
