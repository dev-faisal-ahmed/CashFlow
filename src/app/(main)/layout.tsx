import { MainLayout } from "@/layout";
import { FC, PropsWithChildren } from "react";
import { redirect } from "next/navigation";
import { getAuth } from "@/auth/auth.action";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query.keys";

const Layout: FC<PropsWithChildren> = async ({ children }) => {
  const user = await getAuth();
  if (!user) redirect("/login");

  const queryClient = new QueryClient();

  queryClient.setQueryData([queryKeys.auth.session], user);
  queryClient.setQueryDefaults([queryKeys.auth.session], { staleTime: Infinity });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MainLayout>{children}</MainLayout>
    </HydrationBoundary>
  );
};

export default Layout;
