import { Header } from "@/components/shared";
import { AddRegularTransaction } from "@/features/transaction/component";
import { TopbarContent } from "@/layout";

const Page = () => (
  <>
    <TopbarContent position="left">
      <Header title="Regular Transactions" />
    </TopbarContent>

    <TopbarContent position="right">
      <AddRegularTransaction />
    </TopbarContent>
  </>
);

export default Page;
