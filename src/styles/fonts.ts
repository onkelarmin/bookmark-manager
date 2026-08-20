import localFont from "next/font/local";

export const baseFont = localFont({
  src: "../assets/fonts/Manrope.woff2",
  fallback: ["system-ui", "sans-serif"],
  variable: "--ff-base",
});
