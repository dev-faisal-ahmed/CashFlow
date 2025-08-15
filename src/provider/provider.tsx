import { Toaster } from "sonner";
import { FC, PropsWithChildren } from "react";
import { ThemeProvider } from "./theme.provider";
import { QueryProvider } from "./query.provider";
import { SessionProvider } from "next-auth/react";
import { getAuth } from "@/features/auth/auth.action";

export const Provider: FC<PropsWithChildren> = async ({ children }) => {
  const session = await getAuth();

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <SessionProvider session={session}>
        <QueryProvider>
          <Toaster duration={1500} richColors />
          {children}
        </QueryProvider>
      </SessionProvider>
    </ThemeProvider>
  );
};
