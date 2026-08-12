import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

// next/font las autoaloja y evita el flash de fuente sin estilo. El
// prototipo las cargaba desde Google Fonts por <link>.
// Ambas son variables: sin `weight` cubren todo el rango que usa el hub
// (Fraunces 300-500, Inter 300-600) y `opsz` queda disponible en Fraunces.
const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TINTO",
  description: "Ecosistema financiero para colombianos en el exterior",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`h-full antialiased ${fraunces.variable} ${inter.variable}`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
