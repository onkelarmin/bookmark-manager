import "@/styles/main.scss";
import { baseFont } from "@/styles/fonts";
import { Metadata } from "next";

export const metadata: Metadata = {
  icons: {
    icon: [
      {
        url: "/favicon/favicon-light.svg",
        type: "image/svg+xml",
      },
      {
        url: "/favicon/favicon-dark.svg",
        type: "image/svg+xml",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={baseFont.variable}>
      <body>{children}</body>
    </html>
  );
}
