import { ImageResponse } from "next/og";
import { BRAND } from "@/lib/data";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 72,
          background: "linear-gradient(135deg, #fbfaf8 0%, #f7f5f2 45%, #e9fbff 100%)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: "#22cffc",
              boxShadow: "0 12px 30px rgba(0,0,0,0.12)"
            }}
          />
          <div style={{ fontSize: 28, fontWeight: 800, color: "#0b0e11" }}>{BRAND.name}</div>
        </div>

        <div style={{ marginTop: 22, fontSize: 62, fontWeight: 900, color: "#0b0e11", lineHeight: 1.05 }}>
          Turnos, urgencias y portal
          <br />
          del cliente — en minutos.
        </div>

        <div style={{ marginTop: 22, fontSize: 26, color: "rgba(0,0,0,0.65)", maxWidth: 900 }}>
          Agenda online, orientación inicial en urgencias y seguimiento por WhatsApp en una experiencia veterinaria clara.
        </div>

        <div
          style={{
            marginTop: 34,
            display: "flex",
            gap: 10,
            flexWrap: "wrap"
          }}
        >
          {[
            "Agenda inteligente",
            "Triage con prioridad",
            "Mi Mascota",
            "Panel admin"
          ].map((t) => (
            <div
              key={t}
              style={{
                padding: "10px 14px",
                borderRadius: 999,
                background: "rgba(11,14,17,0.06)",
                color: "#0b0e11",
                fontSize: 20,
                fontWeight: 700
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    size
  );
}
