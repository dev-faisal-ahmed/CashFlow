import { MainLayout } from "@/components/layout";
import { AuthProvider } from "@/features/auth/components";
import { getLoggedUser } from "@/lib/server-action";
import { FC, PropsWithChildren } from "react";
import { redirect } from "next/navigation";

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
