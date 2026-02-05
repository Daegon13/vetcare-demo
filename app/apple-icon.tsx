import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 180,
  height: 180
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b0e11",
          borderRadius: 48
        }}
      >
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: 32,
            background: "#22cffc",
            boxShadow: "0 18px 40px rgba(0,0,0,0.25)"
          }}
        />
      </div>
    ),
    size
  );
}
