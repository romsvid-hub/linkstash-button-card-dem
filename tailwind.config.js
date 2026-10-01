/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      // Figma Variables (ATJ Main design file) mapped 1:1 to Tailwind tokens.
      colors: {
        "bg-card": "#ffffff", // Semantic/Background/bg_card
        "bg-dark-soft": "#363d4a", // Semantic/Background/bg_dark_soft
        "bg-disabled": "#ebeced", // Semantic/Background/bg_disabled
        "border-focus": "#004cff", // Semantic/Border/border_focus
        "accnt-bus-main": "#2a48a2", // Semantic/Brand colors/Accent/accnt_bus_main
        "accnt-user-main": "#c94b2c", // Semantic/Brand colors/Accent/accnt_user_main
        "text-secondary": "#3c4451", // Semantic/Text/Text_secondary
      },
      borderRadius: {
        full: "128px", // Semantic radius/radius-full
      },
      ringWidth: {
        bold: "2px", // stroke/bold
      },
      spacing: {
        "space-8": "8px", // s/space-8
        "space-20": "20px", // m/space-20
      },
      fontFamily: {
        base: ['"Fixel Text"', "system-ui", "sans-serif"], // font-family/base
      },
      fontSize: {
        // Desktop/Body/B2 · 18_26 · R
        b2: ["18px", { lineHeight: "26px", letterSpacing: "-0.5px" }],
      },
    },
  },
  plugins: [],
};
