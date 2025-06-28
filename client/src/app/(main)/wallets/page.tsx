"use client";

import { TopbarContent } from "@/components/layout/app-topbar";
import { Header } from "@/components/shared/header";
import { AddWallet } from "@/features/wallet/components/add-wallet";

const Page = () => (
  <>
    <TopbarContent position="left">
      <Header title="My Wallets" />
    </TopbarContent>

    <TopbarContent position="right">
      <AddWallet />
    </TopbarContent>
  </>
);

export default Page;
