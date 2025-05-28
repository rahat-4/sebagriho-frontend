import type { Metadata } from "next";
import { Outfit, Ovo } from "next/font/google";
import "./globals.css";

import { AuthProvider } from "@/context/AuthContext";

const getOutfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const getOvo = Ovo({
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Sebagriho",
  description: "Healthcare Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${getOutfit.className} ${getOvo.className} antialiased`}
      >
        <AuthProvider>

        {children}
        </AuthProvider>
      </body>
    </html>
  );
}
