export type PetSpecies = "Perro" | "Gato" | "Otro";

export type ServiceId =
  | "consulta"
  | "vacunacion"
  | "desparasitacion"
  | "control"
  | "cirugia"
  | "estetica";

export type AppointmentStatus = "pendiente" | "confirmado" | "cancelado" | "atendido";

export type Appointment = {
  id: string;
  createdAt: string;
  dateISO: string;     // YYYY-MM-DD
  time: string;        // HH:MM
  serviceId: ServiceId;
  petName: string;
  ownerName: string;
  phone: string;
  notes?: string;
  status: AppointmentStatus;
};

export type TriagePriority = "baja" | "media" | "alta";

export type TriageCase = {
  id: string;
  createdAt: string;
  petName: string;
  species: PetSpecies;
  ownerName: string;
  phone: string;
  symptoms: string[];
  freeText?: string;
  priority: TriagePriority;
  recommendedAction: string;
};

export type Vaccine = {
  id: string;
  name: string;
  dateISO: string;
  nextDueISO?: string;
};

export type PetProfile = {
  id: string;
  petName: string;
  species: PetSpecies;
  breed?: string;
  birthYear?: number;
  weightKg?: number;
  allergies?: string;
  vaccines: Vaccine[];
};

export type Campaign = {
  id: string;
  title: string;
  audience: "Clientes" | "Prospectos";
  channel: "WhatsApp" | "Instagram" | "Email";
  message: string;
  scheduledISO: string;
  status: "borrador" | "programada" | "enviada";
};
