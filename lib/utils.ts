export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function formatDateLong(dateISO: string) {
  const d = new Date(dateISO + "T00:00:00");
  return d.toLocaleDateString("es-UY", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

export function toWhatsAppLink(phone: string, text: string) {
  const num = phone.replace(/\D/g, "");
  const msg = encodeURIComponent(text);
  return `https://wa.me/${num}?text=${msg}`;
}
