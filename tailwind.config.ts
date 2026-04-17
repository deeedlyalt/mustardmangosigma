import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1200px",
      },
    },
    extend: {
      fontFamily: {
        nunito: ["Nunito", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        chapter: {
          grundbiologi: "hsl(var(--ch-grundbiologi))",
          ekologi: "hsl(var(--ch-ekologi))",
          kroppen: "hsl(var(--ch-kroppen))",
          nervsystemet: "hsl(var(--ch-nervsystemet))",
          genetik: "hsl(var(--ch-genetik))",
          evolution: "hsl(var(--ch-evolution))",
        },
        xp: "hsl(var(--xp-gold))",
        streak: "hsl(var(--streak-orange))",
        success: "hsl(var(--success))",
        error: "hsl(var(--error))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "bounce-in": {
          "0%": { transform: "scale(0.3)", opacity: "0" },
          "50%": { transform: "scale(1.1)" },
          "70%": { transform: "scale(0.9)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "shake": {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-8px)" },
          "75%": { transform: "translateX(8px)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 5px hsl(var(--xp-gold) / 0.4)" },
          "50%": { boxShadow: "0 0 20px hsl(var(--xp-gold) / 0.8)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "flame-flicker": {
          "0%, 100%": { opacity: "0.9", transform: "scale(1) translateY(0)" },
          "25%": { opacity: "1", transform: "scale(1.05) translateY(-2px)" },
          "50%": { opacity: "0.85", transform: "scale(0.98) translateY(1px)" },
          "75%": { opacity: "1", transform: "scale(1.03) translateY(-1px)" },
        },
        "premium-pulse": {
          "0%, 100%": { boxShadow: "0 0 10px hsl(var(--accent) / 0.4), inset 0 0 20px hsl(var(--accent) / 0.1)" },
          "50%": { boxShadow: "0 0 30px hsl(var(--accent) / 0.9), inset 0 0 30px hsl(var(--accent) / 0.3)" },
        },
        "glitter-spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "rainbow-shift": {
          "0%, 100%": { filter: "hue-rotate(0deg) saturate(1.2)" },
          "50%": { filter: "hue-rotate(180deg) saturate(1.5)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "bounce-in": "bounce-in 0.5s ease-out",
        "shake": "shake 0.4s ease-out",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "slide-up": "slide-up 0.4s ease-out",
        "shimmer": "shimmer 3s linear infinite",
        "flame-flicker": "flame-flicker 0.8s ease-in-out infinite",
        "premium-pulse": "premium-pulse 2.5s ease-in-out infinite",
        "glitter-spin": "glitter-spin 8s linear infinite",
        "rainbow-shift": "rainbow-shift 4s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
