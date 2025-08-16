import { TopbarContent } from "@/layout/";
import { Header } from "@/components/shared";
import { AddWallet, WalletList } from "@/wallet/components";

const Page = async () => {
  return (
    <>
      <TopbarContent position="left">
        <Header title="My Wallets" />
      </TopbarContent>

      <TopbarContent position="right">
        <AddWallet />
      </TopbarContent>

      <WalletList />
    </>
  );
};

export default Page;
