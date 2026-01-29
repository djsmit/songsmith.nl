import { ImageResponse } from "@vercel/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        backgroundColor: "#0a0a0f",
        padding: "60px 80px",
        fontFamily: "system-ui, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Gradient orbs */}
      <div
        style={{
          position: "absolute",
          top: "-100px",
          left: "-100px",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(20, 184, 166, 0.3) 0%, transparent 70%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "100px",
          right: "-50px",
          width: "350px",
          height: "350px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(236, 72, 153, 0.2) 0%, transparent 70%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-80px",
          left: "30%",
          width: "380px",
          height: "380px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, transparent 70%)",
        }}
      />

      {/* Top section with logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          marginBottom: "40px",
          position: "relative",
        }}
      >
        <span
          style={{
            fontSize: "48px",
            fontWeight: "700",
            color: "#14B8A6",
          }}
        >
          Songsmith
        </span>
      </div>

      {/* Main heading */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          justifyContent: "center",
          position: "relative",
        }}
      >
        <h1
          style={{
            fontSize: "72px",
            fontWeight: "700",
            fontFamily: "Inter, sans-serif",
            color: "#ffffff",
            lineHeight: 1.1,
            margin: 0,
            letterSpacing: "-0.03em",
          }}
        >
          Finish more songs.
        </h1>
        <h2
          style={{
            fontSize: "72px",
            fontWeight: "700",
            fontFamily: "Inter, sans-serif",
            background: "linear-gradient(135deg, #14B8A6 0%, #EC4899 50%, #A855F7 100%)",
            backgroundClip: "text",
            color: "transparent",
            lineHeight: 1.1,
            margin: 0,
            letterSpacing: "-0.03em",
          }}
        >
          Write with clarity.
        </h2>
      </div>

      {/* Bottom tagline */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "32px",
          color: "rgba(255, 255, 255, 0.6)",
          fontSize: "24px",
          position: "relative",
        }}
      >
        <span>Three-boxes technique</span>
        <span style={{ color: "#14B8A6" }}>•</span>
        <span>AI-assisted perspectives</span>
        <span style={{ color: "#EC4899" }}>•</span>
        <span>Rhyme palette</span>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  );
}
