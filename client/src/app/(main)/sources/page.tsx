import { Header } from "@/components/shared";
import { AddSource } from "@/features/source/component";
import { TopbarContent } from "@/layout";

const Page = () => (
  <>
    <TopbarContent position="left">
      <Header title="My Sources" />
    </TopbarContent>

    <TopbarContent position="right">
      <AddSource />
    </TopbarContent>
  </>
);

export default Page;
