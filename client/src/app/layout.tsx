import "./globals.css";

import { Metadata } from "next";
import { Inter } from "next/font/google";
import { QueryProvider } from "@/provider/query-provider";
import { FC, PropsWithChildren } from "react";
import { Toaster } from "sonner";
import { GoogleTokenHandler } from "@/features/auth/components/google-token-handler";

const font = Inter({ subsets: ["latin"], weight: ["300", "400", "600", "700"] });
export const metadata: Metadata = { title: "Cash Flow", description: "Manages your cashflow" };

const Layout: FC<PropsWithChildren> = ({ children }) => (
  <html lang="en" suppressHydrationWarning>
    <body className={`${font.className} antialiased`}>
      <GoogleTokenHandler />
      <QueryProvider>
        {children}
        <Toaster duration={1500} richColors />
      </QueryProvider>
    </body>
  </html>
);

export default Layout;
