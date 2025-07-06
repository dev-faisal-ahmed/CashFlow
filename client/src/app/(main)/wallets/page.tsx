import { TopbarContent } from "@/layout/";
import { Header } from "@/components/shared";
import { AddWallet, WalletList } from "@/wallet/components";
import { getToken } from "@/lib/server-action";

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
