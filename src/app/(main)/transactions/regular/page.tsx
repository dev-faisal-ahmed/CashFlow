import { Header } from "@/components/shared";
import { AddRegularTransaction, RegularTransactionList } from "@/features/transaction/component";
import { TopbarContent } from "@/layout";

const Page = () => (
  <>
    <TopbarContent position="left">
      <Header title="Regular Transactions" />
    </TopbarContent>

    <TopbarContent position="right">
      <AddRegularTransaction />
    </TopbarContent>

    <RegularTransactionList />
  </>
);

export default Page;
