/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        /* token colors backed by CSS variables */
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        primary: "rgb(var(--primary) / <alpha-value>)",
        "primary-foreground": "rgb(var(--primary-foreground) / <alpha-value>)",

        /* 👇 add secondary to fix hover:bg-secondary and text-secondary-foreground */
        secondary: "rgb(var(--secondary) / <alpha-value>)",
        "secondary-foreground": "rgb(var(--secondary-foreground) / <alpha-value>)",

        "muted-foreground": "rgb(var(--muted-foreground) / <alpha-value>)",
      },
      fontFamily: {
        /* 👇 this creates a Tailwind utility named `font-secondary` */
        sans: ["Cairo", "ui-sans-serif", "system-ui", "sans-serif"],
        secondary: ['"Playfair Display"', "serif"],
      },
      container: { center: true, padding: "1rem" },
    },
  },
  plugins: [],
};
