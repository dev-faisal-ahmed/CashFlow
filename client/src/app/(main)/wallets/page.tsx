"use client";

import { TopbarContent } from "@/components/layout";
import { Header } from "@/components/shared";
import { AddWallet } from "@/wallet/components";

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
