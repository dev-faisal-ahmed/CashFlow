import { MainLayout } from "@/layout";
import { FC, PropsWithChildren } from "react";
import { redirect } from "next/navigation";
import { getAuth } from "@/auth/auth.action";

const Layout: FC<PropsWithChildren> = async ({ children }) => {
  const user = await getAuth();
  if (!user) redirect("/login");

  return (
    <MainLayout>
      {/* <AuthProvider user={user} /> */}
      {children}
    </MainLayout>
  );
};

export default Layout;
