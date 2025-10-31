// web/tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Warm, gentle pastels (not "hot")
        ember: {
          50:  "#FFF8F5",
          100: "#FFEFE6",
          200: "#FFDCD2",
          300: "#FFCFC0",
          400: "#FFBEAB",
          500: "#F4A996",
          600: "#E2917D",
        },
        apricot: {
          50:  "#FFFAF0",
          100: "#FFF3D6",
          200: "#FFE3AD",
          300: "#FFD38C",
          400: "#FFC26E",
          500: "#FFB457",
        },
        blush: {
          50:  "#FFF7FA",
          100: "#FDECF2",
          200: "#FADDE8",
          300: "#F6C7D7",
          400: "#F2AEC5",
          500: "#EB96B4",
        },
        cream: {
          50:  "#FFFCF8",
          100: "#FBF7F0",
        },
        ink: "#27303F",
        stone: {
          100: "#f5f5f4",
          200: "#e7e5e4",
          300: "#d6d3d1",
          600: "#57534e",
          700: "#44403c",
        },
      },
      borderRadius: {
        xl: "0.9rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        soft: "0 6px 22px rgba(39, 48, 63, 0.06)",
      },
      maxWidth: {
        wrap: "68rem",
        text: "36rem",
      },
    },
  },
  plugins: [],
};

export default config;
