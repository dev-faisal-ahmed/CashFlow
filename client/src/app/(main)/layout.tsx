import { MainLayout } from "@/components/layout/main-layout";
import { AuthProvider } from "@/features/auth/components/auth-provider";
import { getLoggedUser } from "@/lib/server-action";
import { redirect } from "next/navigation";
import { FC, PropsWithChildren } from "react";

const Layout: FC<PropsWithChildren> = async ({ children }) => {
  const user = await getLoggedUser();
  if (!user) redirect("/login");

  return (
    <MainLayout>
      <AuthProvider user={user} />
      {children}
    </MainLayout>
  );
};

export default Layout;
