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

export type OrderStatus = "pendiente" | "confirmado" | "preparando" | "en_camino" | "listo" | "entregado" | "cancelado";
export type FulfillmentMethod = "delivery" | "retiro";

export type DeliveryDetails = { address: string; neighborhood?: string; instructions?: string };
export type OrderItem = { productId: string; name: string; quantity: number; unitPrice: number; category: string };
export type Order = {
  id: string; createdAt: string; ownerName: string; phone: string; petId?: string; petName: string;
  items: OrderItem[]; fulfillment: FulfillmentMethod; deliveryDetails?: DeliveryDetails; notes?: string;
  status: OrderStatus; subtotal: number;
};
export type SavedItem = { id: string; petId: string; productId: string; name: string; lastOrderedAt: string };
export type SavedService = { id: string; petId: string; serviceId: ServiceId; name: string; lastUsedAt: string };
