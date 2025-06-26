import "./globals.css";

import { Metadata } from "next";
import { Inter } from "next/font/google";
import { QueryProvider } from "@/provider/query-provider";
import { FC, PropsWithChildren } from "react";
import { Toaster } from "sonner";

const font = Inter({ subsets: ["latin"], weight: ["300", "400", "600", "700"] });
export const metadata: Metadata = { title: "Cash Flow", description: "Manages your cashflow" };

const Layout: FC<PropsWithChildren> = ({ children }) => (
  <html lang="en" suppressHydrationWarning>
    <body className={`${font.className} antialiased`}>
      <QueryProvider>
        {children}

        <Toaster duration={1500} richColors />
      </QueryProvider>
    </body>
  </html>
);

export default Layout;
