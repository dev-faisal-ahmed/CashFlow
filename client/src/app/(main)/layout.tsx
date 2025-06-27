import { MainLayout } from "@/components/layout/main-layout";
import { FC, PropsWithChildren } from "react";

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return <MainLayout>{children}</MainLayout>;
};

export default Layout;
