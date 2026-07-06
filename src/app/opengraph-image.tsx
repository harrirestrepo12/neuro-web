import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Neuro Trading - AI Intelligence. Market Edge.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "linear-gradient(135deg, #081320 0%, #0b1b2e 52%, #021012 100%)",
          color: "white",
          position: "relative",
          overflow: "hidden",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 20% 20%, rgba(0,229,255,0.34), transparent 34%), radial-gradient(circle at 80% 25%, rgba(50,240,122,0.22), transparent 36%), radial-gradient(circle at 50% 90%, rgba(0,203,167,0.2), transparent 38%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 80,
            top: 72,
            right: 80,
            bottom: 72,
            border: "1px solid rgba(255,255,255,0.14)",
            borderRadius: 42,
            background: "rgba(0,0,0,0.28)",
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "86px 100px",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 42 }}>
            <div
              style={{
                width: 96,
                height: 96,
                borderRadius: 28,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #00E5FF, #32F07A)",
                color: "#06111f",
                fontSize: 56,
                fontWeight: 900,
              }}
            >
              N
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 28, letterSpacing: 7, color: "#99f6e4", fontWeight: 800 }}>NEURO</div>
              <div style={{ fontSize: 28, color: "rgba(255,255,255,0.82)", fontWeight: 700 }}>
                Trading Platform
              </div>
            </div>
          </div>

          <div style={{ fontSize: 76, lineHeight: 0.96, fontWeight: 900, maxWidth: 870, letterSpacing: -3 }}>
            Plataforma de trading con inteligencia artificial
          </div>

          <div style={{ marginTop: 34, fontSize: 30, color: "rgba(255,255,255,0.72)", maxWidth: 850, lineHeight: 1.35 }}>
            Web App instalable · Gestión de riesgo · Conexión a broker · AI Intelligence. Market Edge.
          </div>

          <div style={{ marginTop: 46, display: "flex", gap: 18, fontSize: 23, fontWeight: 800, color: "#06111f" }}>
            <div style={{ borderRadius: 999, padding: "16px 26px", background: "#00E5FF" }}>neurotrading.app</div>
            <div style={{ borderRadius: 999, padding: "16px 26px", background: "#32F07A" }}>app.neurotrading.app</div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
