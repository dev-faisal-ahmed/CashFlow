import { Toaster } from "sonner";
import { FC, PropsWithChildren } from "react";
import { ThemeProvider } from "./theme.provider";
import { QueryProvider } from "./query.provider";

export const Provider: FC<PropsWithChildren> = async ({ children }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <QueryProvider>
        <Toaster duration={1500} richColors />
        {children}
      </QueryProvider>
    </ThemeProvider>
  );
};
