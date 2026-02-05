import { ImageResponse } from "next/og";
import { BRAND } from "@/lib/data";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0B1220 0%, #111827 55%, #0B1220 100%)",
          color: "#F8FAFC",
          position: "relative",
          fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
        }}
      >
        {/* Glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 30% 35%, rgba(34, 207, 252, 0.35) 0%, rgba(34, 207, 252, 0) 55%), radial-gradient(circle at 75% 65%, rgba(34, 207, 252, 0.22) 0%, rgba(34, 207, 252, 0) 60%)",
          }}
        />

        {/* Card */}
        <div
          style={{
            width: 980,
            padding: 56,
            borderRadius: 28,
            background: "rgba(255, 255, 255, 0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: "0 25px 60px rgba(0,0,0,0.45)",
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: 999,
                background: "#22CFFC",
                boxShadow: "0 0 0 6px rgba(34, 207, 252, 0.18)",
              }}
            />
            <div style={{ fontSize: 22, letterSpacing: 0.6, opacity: 0.9 }}>{BRAND.hours}</div>
          </div>

          <div style={{ fontSize: 64, fontWeight: 800, letterSpacing: -1.4, lineHeight: 1.05 }}>{BRAND.name}</div>
          <div style={{ fontSize: 30, opacity: 0.9, maxWidth: 820 }}>{BRAND.tagline}</div>

          <div style={{ display: "flex", gap: 12, marginTop: 14, flexWrap: "wrap" }}>
            {[
              "Turnos sin fricción",
              "Triage de urgencias",
              "Portal Mi Mascota",
              "Seguimiento + WhatsApp",
              "Admin panel",
            ].map((t) => (
              <div
                key={t}
                style={{
                  padding: "10px 14px",
                  borderRadius: 999,
                  fontSize: 18,
                  background: "rgba(34, 207, 252, 0.12)",
                  border: "1px solid rgba(34, 207, 252, 0.25)",
                }}
              >
                {t}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 18, opacity: 0.9, fontSize: 20 }}>
            <div>{BRAND.address}</div>
            <div>WhatsApp: {BRAND.whatsapp}</div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
