import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#FAF7EE",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 64 64"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main sparkle */}
          <path
            d="M32 12 L37 27 L52 32 L37 37 L32 52 L27 37 L12 32 L27 27 Z"
            fill="#7E91C0"
          />
          {/* Tiny corner sparkle */}
          <path
            d="M52 14 L53.5 18.5 L58 20 L53.5 21.5 L52 26 L50.5 21.5 L46 20 L50.5 18.5 Z"
            fill="#7E91C0"
            opacity="0.85"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
