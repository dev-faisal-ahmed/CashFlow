import { Header } from "@/components/shared";
import { AddRegularTransaction, RegularTransactionTable } from "@/features/transaction/component/regular";
import { TopbarContent } from "@/layout";

const Page = () => (
  <>
    <TopbarContent position="left">
      <Header title="Regular Transactions" />
    </TopbarContent>

    <TopbarContent position="right">
      <AddRegularTransaction />
    </TopbarContent>

    <RegularTransactionTable />
  </>
);

export default Page;
