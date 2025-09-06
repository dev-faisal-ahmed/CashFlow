import { Header } from "@/components/shared";
import { AddPeerTransactionFromTransaction, PeerTransactionTable } from "@/features/transaction/component/peer-transaction";
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
