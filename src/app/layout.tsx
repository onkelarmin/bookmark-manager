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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
