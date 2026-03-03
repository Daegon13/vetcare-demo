import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        graphite: {
          950: "#0b0e11",
          900: "#101418",
          800: "#141a20",
          700: "#1b232c",
          600: "#25303b"
        },
        warm: {
          50: "#fbfaf8",
          100: "#f7f5f2",
          200: "#efece7"
        },
        cyanSoft: {
          50: "#e9fbff",
          100: "#c9f3ff",
          200: "#8fe7ff",
          300: "#57dbff",
          400: "#22cffc",
          500: "#00b9e6"
        }
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.12)",
        lift: "0 18px 45px rgba(0,0,0,0.18)"
      }
    }
  },
  plugins: []
} satisfies Config;
