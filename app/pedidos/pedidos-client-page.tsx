"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { PRODUCT_CATALOG } from "@/lib/data";
import type { FulfillmentMethod, Order, OrderItem } from "@/lib/types";
import { loadOrders, loadPet, saveOrders } from "@/lib/storage";
import { trackEvent } from "@/lib/analytics";
import { uid } from "@/lib/utils";
import { Container, Card, CardContent, Badge, Button, Field, Input, Textarea, LinkButton } from "@/components/ui";
import { SectionHeading } from "@/components/section";

const money = (value: number) => new Intl.NumberFormat("es-UY", { style: "currency", currency: "UYU", maximumFractionDigits: 0 }).format(value);

export default function PedidosClientPage() {
  const params = useSearchParams();
  const pet = React.useMemo(() => loadPet(), []);
  const [cart, setCart] = React.useState<Record<string, number>>({});
  const [fulfillment, setFulfillment] = React.useState<FulfillmentMethod>("delivery");
  const [ownerName, setOwnerName] = React.useState("Martín Pérez");
  const [phone, setPhone] = React.useState("+598 98 555 221");
  const [petName, setPetName] = React.useState(pet.petName);
  const [address, setAddress] = React.useState("Av. Italia 2840");
  const [neighborhood, setNeighborhood] = React.useState("Parque Batlle");
  const [instructions, setInstructions] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [created, setCreated] = React.useState<Order | null>(null);
  const [error, setError] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    const product = params.get("producto");
    if (product && PRODUCT_CATALOG.some(item => item.id === product)) setCart({ [product]: 1 });
    trackEvent("order_started", { source: product ? "reorder" : "catalog" });
  }, [params]);

  const items: OrderItem[] = PRODUCT_CATALOG.filter(product => (cart[product.id] ?? 0) > 0).map(product => ({
    productId: product.id, name: product.name, quantity: cart[product.id]!, unitPrice: product.price, category: product.category
  }));
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const changeQty = (id: string, delta: number) => setCart(current => ({ ...current, [id]: Math.max(0, (current[id] ?? 0) + delta) }));

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    const missing: string[] = [];
    if (!items.length) missing.push("al menos un producto");
    if (!ownerName.trim()) missing.push("el nombre del tutor");
    if (!petName.trim()) missing.push("la mascota");
    if (phone.replace(/\D/g, "").length < 8) missing.push("un teléfono válido");
    if (fulfillment === "delivery" && !address.trim()) missing.push("la dirección de entrega");
    if (missing.length) {
      setError(`Revisá estos datos: ${missing.join(", ")}.`);
      return;
    }
    setSubmitting(true);
    setError("");
    const order: Order = {
      id: `VC-${uid("pedido").split("_")[1]!.slice(0, 6).toUpperCase()}`, createdAt: new Date().toISOString(), ownerName: ownerName.trim(), phone: phone.trim(),
      petId: petName.trim().toLowerCase() === pet.petName.toLowerCase() ? pet.id : undefined, petName: petName.trim(), items, fulfillment,
      deliveryDetails: fulfillment === "delivery" ? { address: address.trim(), neighborhood: neighborhood.trim() || undefined, instructions: instructions.trim() || undefined } : undefined,
      notes: notes.trim() || undefined, status: "pendiente", subtotal
    };
    saveOrders([order, ...loadOrders()]);
    setCreated(order);
    trackEvent("order_completed", { fulfillment, items: items.length, subtotal });
  }

  if (created) return <Container className="py-10"><Card className="mx-auto max-w-2xl border-cyanSoft-400/50"><CardContent className="grid gap-5 p-6 sm:p-8">
    <Badge tone="good" className="w-fit">Recibido · pendiente de confirmación</Badge>
    <h1 className="text-3xl font-black">Pedido #{created.id} recibido</h1>
    <p className="text-black/65 dark:text-white/70">La veterinaria revisará el pedido y confirmará disponibilidad, importe y {created.fulfillment === "delivery" ? "entrega" : "momento de retiro"}. No realizaste ningún pago.</p>
    <div className="rounded-2xl bg-black/5 p-4 text-sm dark:bg-white/10"><div className="font-extrabold">{created.petName} · {created.fulfillment === "delivery" ? "Envío a domicilio" : "Retiro en veterinaria"}</div>{created.items.map(i => <div key={i.productId}>{i.quantity} × {i.name}</div>)}<div className="mt-2 font-bold">Subtotal demostrativo: {money(created.subtotal)}</div></div>
    <p className="text-sm">Siguiente paso: el equipo se comunicará al {created.phone}. Pago a coordinar con la veterinaria.</p>
    <div className="flex flex-wrap gap-2"><LinkButton href="/mi-mascota">Ver en Mi Mascota</LinkButton><LinkButton href="/adminv1?demo=1" variant="outline">Ver ingreso en admin</LinkButton></div>
  </CardContent></Card></Container>;

  return <Container className="py-10"><SectionHeading eyebrow="Autoservicio cotidiano" title="Pedido rápido a tu veterinaria" desc="Elegí productos habituales y enviá la solicitud sin llamar. El equipo valida disponibilidad y coordina el siguiente paso." />
    <div className="mt-4 rounded-2xl border border-amber-300/50 bg-amber-50 p-4 text-sm text-amber-950">Catálogo demostrativo: no representa stock ni entrega en tiempo real. Los productos preventivos se confirman según la mascota y criterio veterinario.</div>
    <form onSubmit={submit} className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      <div className="grid gap-4"><h2 className="text-xl font-black">1. ¿Qué necesitás?</h2><div className="grid gap-3 sm:grid-cols-2">
        {PRODUCT_CATALOG.map(product => <Card key={product.id}><CardContent className="grid h-full gap-3 p-5"><div className="flex justify-between gap-2"><Badge tone="neutral">{product.category}</Badge><strong>{money(product.price)}</strong></div><div><h3 className="font-extrabold">{product.name}</h3><p className="mt-1 text-sm text-black/60 dark:text-white/70">{product.description}</p></div>{"requiresValidation" in product ? <p className="text-xs font-semibold text-amber-700">Requiere validación veterinaria antes de confirmar.</p> : null}<div className="mt-auto flex items-center gap-2"><Button type="button" variant="outline" onClick={() => changeQty(product.id, -1)} aria-label={`Quitar ${product.name}`}>−</Button><span className="min-w-8 text-center font-bold" aria-label={`Cantidad ${cart[product.id] ?? 0}`}>{cart[product.id] ?? 0}</span><Button type="button" onClick={() => changeQty(product.id, 1)}>Agregar</Button></div></CardContent></Card>)}
      </div></div>
      <Card className="h-fit lg:sticky lg:top-24"><CardContent className="grid gap-5 p-5"><h2 className="text-xl font-black">2. Resumen</h2>{items.length ? items.map(item => <div key={item.productId} className="flex justify-between gap-3 text-sm"><span>{item.quantity} × {item.name}</span><strong>{money(item.quantity * item.unitPrice)}</strong></div>) : <p className="text-sm text-black/55">Agregá al menos un producto.</p>}<div className="border-t pt-3 font-black">Subtotal demo: {money(subtotal)}</div>
        <Field label="Observaciones (opcional)"><Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Presentación preferida u otra aclaración" /></Field>
        <fieldset className="grid gap-2"><legend className="font-extrabold">3. Entrega</legend><label className="flex min-h-11 items-center gap-2 rounded-xl border p-3"><input type="radio" checked={fulfillment === "delivery"} onChange={() => { setFulfillment("delivery"); trackEvent("delivery_selected", { method: "delivery" }); }} /> Envío a domicilio</label><label className="flex min-h-11 items-center gap-2 rounded-xl border p-3"><input type="radio" checked={fulfillment === "retiro"} onChange={() => { setFulfillment("retiro"); trackEvent("delivery_selected", { method: "retiro" }); }} /> Retiro en veterinaria</label></fieldset>
        {fulfillment === "delivery" ? <div className="grid gap-3"><Field label="Dirección"><Input required value={address} onChange={e => setAddress(e.target.value)} /></Field><Field label="Barrio (opcional)"><Input value={neighborhood} onChange={e => setNeighborhood(e.target.value)} /></Field><Field label="Instrucciones (opcional)"><Input value={instructions} onChange={e => setInstructions(e.target.value)} /></Field></div> : null}
        <h2 className="text-lg font-black">4. Datos de contacto</h2><Field label="Nombre"><Input required value={ownerName} onChange={e => setOwnerName(e.target.value)} /></Field><Field label="Teléfono"><Input required type="tel" value={phone} onChange={e => setPhone(e.target.value)} /></Field><Field label="Mascota"><Input required value={petName} onChange={e => setPetName(e.target.value)} /></Field>
        {error ? <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm font-semibold text-rose-800">{error}</p> : null}
        <Button type="submit" disabled={!items.length || submitting}>{submitting ? "Enviando pedido…" : "Enviar pedido · sin pagar"}</Button><p className="text-xs text-black/50">5. Al confirmar verás el número y el próximo paso. Pago y disponibilidad se coordinan con la veterinaria.</p>
      </CardContent></Card>
    </form>
  </Container>;
}
