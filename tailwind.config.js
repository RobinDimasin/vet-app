/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    {
      pattern: /./,
    },
  ],
  daisyui: {
    themes: [
      {
        mytheme: {
          ...require("daisyui/src/colors/themes")["[data-theme=corporate]"],
          primary: "#1A72FA",
          // secondary: "#EF9FBC",
          accent: "#EEAF3A",
          // neutral: "#291334",
          "base-100": "#FFFCFC",
          "base-200": "#F7FBFF",
          "base-300": "#f5f7fa",
          info: "#72BAF5",
          success: "#70E0AA",
          // warning: "#FBBD23",
          error: "#F93E3E",
          // "--rounded-box": "0.25rem",
          // "--rounded-btn": "0.125rem",
          // "--rounded-badge": "0.125rem",
          // "--animation-btn": "0.25s",
          // "--animation-input": "0.2s",
          // "--btn-text-case": "uppercase",
          // "--btn-focus-scale": "0.95",
          // "--border-btn": "1px",
          // "--tab-border": "1px",
          // "--tab-radius": "0.5rem",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
