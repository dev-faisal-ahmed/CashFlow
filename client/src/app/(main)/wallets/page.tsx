import { TopbarContent } from "@/components/layout";
import { Header } from "@/components/shared";
import { WalletList } from "@/features/wallet/components/wallet-list";
import { getToken } from "@/lib/server-action";
import { AddWallet } from "@/wallet/components";

const Page = async () => {
  const token = await getToken();
  console.log(token);

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
