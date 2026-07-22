import type { Metadata } from "next";
import { inter, nunito } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "FIRE PASS™ | 100Lat",
  description: "Gamified financial education funnel for latinos in USA.",
  openGraph: {
    title: "FIRE PASS™ | 100Lat",
    description: "Gamified financial education funnel for latinos in USA.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${nunito.variable} ${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
