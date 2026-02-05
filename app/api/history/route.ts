import { NextResponse } from "next/server";

// Mock de historial clínico.
// En un producto real esto vendría de un backend autenticado.

export const runtime = "nodejs";

type HistoryItem = { id: string; dateISO: string; title: string; notes: string };

function buildMock(): HistoryItem[] {
  const today = new Date();
  const iso = (d: Date) => d.toISOString().slice(0, 10);

  const d1 = new Date(today.getTime() - 1000 * 60 * 60 * 24 * 14);
  const d2 = new Date(today.getTime() - 1000 * 60 * 60 * 24 * 48);
  const d3 = new Date(today.getTime() - 1000 * 60 * 60 * 24 * 90);

  return [
    {
      id: "h_1",
      dateISO: iso(d1),
      title: "Control general",
      notes:
        "Chequeo completo. Recomendación: control de peso y rutina de paseo. Sin hallazgos de alarma."
    },
    {
      id: "h_2",
      dateISO: iso(d2),
      title: "Vacunación",
      notes:
        "Dosis aplicada sin complicaciones. Se dejó recordatorio para próxima fecha."
    },
    {
      id: "h_3",
      dateISO: iso(d3),
      title: "Consulta por piel",
      notes:
        "Irritación leve. Se indicó higiene suave y seguimiento si persiste."
    }
  ];
}

export async function GET() {
  return NextResponse.json({ items: buildMock() }, { headers: { "Cache-Control": "no-store" } });
}
