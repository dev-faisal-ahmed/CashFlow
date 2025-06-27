import "./globals.css";

import { Metadata } from "next";
import { Inter } from "next/font/google";
import { QueryProvider } from "@/provider/query-provider";
import { FC, PropsWithChildren } from "react";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/provider/theme-provider";

const font = Inter({ subsets: ["latin"], weight: ["300", "400", "600", "700"] });
export const metadata: Metadata = { title: "Cash Flow", description: "Manages your cashflow" };

const Layout: FC<PropsWithChildren> = ({ children }) => (
  <html className="dark" lang="en" suppressHydrationWarning>
    <body className={`${font.className} antialiased`}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <QueryProvider>
          <Toaster duration={1500} richColors />
          {children}
        </QueryProvider>
      </ThemeProvider>
    </body>
  </html>
);

export default Layout;
