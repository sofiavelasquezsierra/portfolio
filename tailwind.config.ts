import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Warmer-white base — closer to white but still has warmth.
        cream: "#FAF7EE",
        ink: "#2C3E50",
        mute: "#6B7785",
        codebg: "#F1ECDF",

        // Primary accent — periwinkle. Replaces dusty rose.
        rose: "#7E91C0",
        sage: "#7FA17F",
        honey: "#D9B068",

        // Soft palette — slightly more saturated than before, still pastel.
        sky: "#A8C5DC",
        peach: "#F2B89A",
        blush: "#E8B5C0",
        butter: "#F2DC9C",
        lavender: "#B8AED4",

        // Back-compat alias — anywhere `coral` is still in JSX, it picks up
        // the new periwinkle.
        coral: "#7E91C0",
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        hand: ["var(--font-caveat)", "cursive"],
      },
      maxWidth: {
        page: "1200px",
      },
      animation: {
        twinkle: "twinkle 3s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        shoot: "shoot 1.6s ease-out forwards",
      },
      keyframes: {
        twinkle: {
          "0%,100%": { opacity: "0.3", transform: "scale(0.9)" },
          "50%": { opacity: "1", transform: "scale(1.1)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shoot: {
          "0%": { transform: "translate(0,0) rotate(-20deg)", opacity: "0" },
          "10%": { opacity: "1" },
          "100%": { transform: "translate(420px,180px) rotate(-20deg)", opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
