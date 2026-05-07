import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#FAF7EE",
          borderRadius: "32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width="140"
          height="140"
          viewBox="0 0 64 64"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M32 8 L38 26 L56 32 L38 38 L32 56 L26 38 L8 32 L26 26 Z"
            fill="#7E91C0"
          />
          <path
            d="M52 12 L54 18 L60 20 L54 22 L52 28 L50 22 L44 20 L50 18 Z"
            fill="#7E91C0"
            opacity="0.9"
          />
          <path
            d="M14 46 L15.5 50 L19.5 51.5 L15.5 53 L14 57 L12.5 53 L8.5 51.5 L12.5 50 Z"
            fill="#7E91C0"
            opacity="0.75"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
