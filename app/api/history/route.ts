import { NextResponse } from "next/server";

export async function GET() {
  // Mock historial clínico (demo)
  const data = [
    {
      id: "h1",
      dateISO: "2025-05-18",
      title: "Consulta general",
      notes: "Buen estado general. Se recomienda control anual y refuerzo de vacunas."
    },
    {
      id: "h2",
      dateISO: "2025-09-02",
      title: "Control de piel",
      notes: "Irritación leve. Shampoo medicado por 7 días. Mejoró al control."
    },
    {
      id: "h3",
      dateISO: "2026-01-12",
      title: "Chequeo preventivo",
      notes: "Peso estable. Se pauta desparasitación trimestral."
    }
  ];
  return NextResponse.json({ items: data }, { headers: { "Cache-Control": "no-store" } });
}
