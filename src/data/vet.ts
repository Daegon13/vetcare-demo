import type { ServiceId, PetSpecies } from "@/lib/types";

// Fuente única de datos mock para la demo.
// Mantenerlo acá permite “rebrandear” la demo cambiando un solo archivo.

export const clinica = {
  nombre: "VetCare",
  ciudad: "Montevideo",
  whatsapp: "+59891234567",
  whatsappUrl: "https://wa.me/59891234567?text=Hola%20VetCare%2C%20quiero%20ver%20como%20funciona%20la%20demo.",
  ctaImplementacionLabel: "Quiero esto para mi veterinaria",
  ctaImplementacionUrl: "/contacto-demo",
  telefono: "+598 91 234 567",
  direccion: "Av. Principal 1234, Montevideo",
  horarios: "Lun a Sáb · 9:00–19:00"
};

export const servicios: {
  id: ServiceId;
  categoria: "consulta" | "vacunas" | "cirugía" | "laboratorio" | "internación" | "grooming";
  nombre: string;
  duracionMin: number;
  bufferMin: number;
  precioDesde: string;
  descripcion: string;
}[] = [
  {
    id: "consulta",
    categoria: "consulta",
    nombre: "Consulta general",
    duracionMin: 30,
    bufferMin: 10,
    precioDesde: "$ 900",
    descripcion: "Revisión clínica, plan de cuidado y seguimiento."
  },
  {
    id: "control",
    categoria: "consulta",
    nombre: "Control + chequeo",
    duracionMin: 40,
    bufferMin: 10,
    precioDesde: "$ 1200",
    descripcion: "Chequeo preventivo con recomendaciones claras."
  },
  {
    id: "vacunacion",
    categoria: "vacunas",
    nombre: "Vacunación",
    duracionMin: 20,
    bufferMin: 10,
    precioDesde: "$ 750",
    descripcion: "Esquema completo y recordatorios para mantener al día."
  },
  {
    id: "desparasitacion",
    categoria: "vacunas",
    nombre: "Desparasitación",
    duracionMin: 20,
    bufferMin: 10,
    precioDesde: "$ 600",
    descripcion: "Interna/externa según especie y peso."
  },
  {
    id: "cirugia",
    categoria: "cirugía",
    nombre: "Cirugía programada",
    duracionMin: 60,
    bufferMin: 20,
    precioDesde: "A cotizar",
    descripcion: "Evaluación + prequirúrgico + seguimiento."
  },
  {
    id: "estetica",
    categoria: "grooming",
    nombre: "Grooming / Baño",
    duracionMin: 60,
    bufferMin: 15,
    precioDesde: "$ 1400",
    descripcion: "Baño, corte higiénico y cuidado de piel."
  }
];

export const staff: {
  id: string;
  nombre: string;
  rol: "Veterinario" | "Asistente" | "Groomer";
  especialidades: string[];
  disponibilidad: { dia: string; desde: string; hasta: string }[];
}[] = [
  {
    id: "s1",
    nombre: "Dra. Valentina Ríos",
    rol: "Veterinario",
    especialidades: ["Clínica general", "Urgencias", "Medicina preventiva"],
    disponibilidad: [
      { dia: "Lunes", desde: "09:00", hasta: "14:00" },
      { dia: "Miércoles", desde: "12:00", hasta: "19:00" },
      { dia: "Viernes", desde: "09:00", hasta: "14:00" }
    ]
  },
  {
    id: "s2",
    nombre: "Dr. Martín Silva",
    rol: "Veterinario",
    especialidades: ["Cirugía", "Traumatología"],
    disponibilidad: [
      { dia: "Martes", desde: "09:00", hasta: "17:00" },
      { dia: "Jueves", desde: "12:00", hasta: "19:00" }
    ]
  },
  {
    id: "s3",
    nombre: "Lucía Núñez",
    rol: "Groomer",
    especialidades: ["Baño", "Corte higiénico", "Piel sensible"],
    disponibilidad: [
      { dia: "Sábado", desde: "09:00", hasta: "17:00" }
    ]
  }
];

export const vacunas: {
  especie: PetSpecies;
  esquema: { nombre: string; frecuencia: "anual" | "semestral" | "refuerzo"; nota?: string }[];
}[] = [
  {
    especie: "Perro",
    esquema: [
      { nombre: "Antirrábica", frecuencia: "anual" },
      { nombre: "Polivalente", frecuencia: "anual", nota: "Refuerzo según edad y antecedentes" },
      { nombre: "Desparasitación", frecuencia: "semestral" }
    ]
  },
  {
    especie: "Gato",
    esquema: [
      { nombre: "Triple felina", frecuencia: "anual" },
      { nombre: "Antirrábica", frecuencia: "anual" },
      { nombre: "Desparasitación", frecuencia: "semestral" }
    ]
  },
  {
    especie: "Otro",
    esquema: [
      { nombre: "Plan personalizado", frecuencia: "refuerzo", nota: "Depende de especie/peso" }
    ]
  }
];

export const testimonios = [
  {
    nombre: "Carolina M.",
    texto: "Entré por WhatsApp con dudas y terminé con turno confirmado en 2 minutos. Súper claro y humano."
  },
  {
    nombre: "Diego R.",
    texto: "El triage me dijo qué hacer en el momento. Me bajó la ansiedad y me guiaron perfecto."
  },
  {
    nombre: "Sofía L.",
    texto: "El portal de vacunas me salvó: recordatorio y listo, sin llamadas al mostrador."
  }
];

export const faqs = [
  {
    q: "¿Puedo agendar sin llamar?",
    a: "Sí. En la demo, el turno se confirma y queda guardado. En producción se conecta con WhatsApp/Email."
  },
  {
    q: "¿El triage reemplaza a una consulta?",
    a: "No. Sirve para priorizar y darte una guía inmediata. En urgencia alta, la indicación siempre es contactar o venir ya."
  },
  {
    q: "¿Cómo funcionan los recordatorios?",
    a: "En demo se simulan. En producción se automatizan por WhatsApp/Email con plantillas aprobadas."
  }
];
