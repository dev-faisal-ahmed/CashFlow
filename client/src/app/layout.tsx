import "./globals.css";

import { Metadata } from "next";
import { Inter } from "next/font/google";
import { PropsWithChildren } from "react";

const font = Inter({ subsets: ["latin"], weight: ["300", "400", "600", "700"] });

export const metadata: Metadata = {
  title: "Cash Flow",
  description: "Manages your cashflow",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className={`${font.className} antialiased`}>{children}</body>
    </html>
  );
}
