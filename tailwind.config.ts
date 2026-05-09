import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#F8E59A",
        "bg-blue": "#B9D9EB",
        nav: "#A20067",
        "nav-text": "#F8E59A",
        "heading-rose": "#A20067",
        "heading-olive": "#94AF00",
        "body-text": "#A20067",
        "muted-pink": "#F59BBB",
        "accent-orange": "#F49D5A",
      },
      fontFamily: {
        script: ["var(--font-display)", "cursive"],
        serif: ["var(--font-body)", "Georgia", "serif"],
        sans: ["var(--font-body)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
