import type { Metadata } from "next";
import { Outfit, Ovo } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/context/ClientLayout";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["400", "500", "600", "700"],
});

const ovo = Ovo({
  subsets: ["latin"],
  variable: "--font-ovo",
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Sebagriho | Healthcare platform",
  description: "Sebagriho healthcare operations and administration platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${ovo.variable} bg-background text-foreground antialiased`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
