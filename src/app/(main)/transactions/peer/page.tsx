import { Header } from "@/components/shared";
import { AddPeerTransactionFromTransaction, PeerTransactionTable } from "@/transaction/component/peer";
import { TopbarContent } from "@/layout";

const Page = () => (
  <>
    <TopbarContent position="left">
      <Header title="Peer Transactions" />
    </TopbarContent>

    <TopbarContent position="right">
      <AddPeerTransactionFromTransaction />
    </TopbarContent>

    <PeerTransactionTable />
  </>
);

export default Page;
