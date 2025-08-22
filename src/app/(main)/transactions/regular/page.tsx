import { Header } from "@/components/shared";
import { AddTransaction } from "@/features/transaction/component";
import { TopbarContent } from "@/layout";

const Page = () => (
  <>
    <TopbarContent position="left">
      <Header title="Regular Transactions" />
    </TopbarContent>

    <TopbarContent position="right">
      <AddTransaction />
    </TopbarContent>
  </>
);

export default Page;
