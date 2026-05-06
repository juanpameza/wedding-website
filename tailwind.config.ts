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
        bg: "#ede0d8",
        nav: "#3a4228",
        "nav-text": "#f5f0eb",
        "heading-rose": "#8b3535",
        "heading-olive": "#7a6c3d",
        "body-text": "#5a4835",
        "muted-rose": "#c8a89a",
        "accent-green": "#4a5c2e",
      },
      fontFamily: {
        script: ["var(--font-great-vibes)", "cursive"],
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-cormorant)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
