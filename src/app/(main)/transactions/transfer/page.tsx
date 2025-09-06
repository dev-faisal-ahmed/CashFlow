import { Header } from "@/components/shared";
import { TransferTransactionTable } from "@/features/transaction/component/transfer";
import { TopbarContent } from "@/layout";

const Page = () => (
  <>
    <TopbarContent position="left">
      <Header title="Transfer Transactions" />
    </TopbarContent>

    <TransferTransactionTable />
  </>
);

export default Page;
