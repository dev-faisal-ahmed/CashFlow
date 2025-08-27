import { Header } from "@/components/shared";
import { AddPeerTransactionFromTransaction } from "@/features/transaction/component";
import { TopbarContent } from "@/layout";

const Page = () => (
  <>
    <TopbarContent position="left">
      <Header title="Peer to Peer" />
    </TopbarContent>

    <TopbarContent position="right">
      <AddPeerTransactionFromTransaction />
    </TopbarContent>
  </>
);

export default Page;
