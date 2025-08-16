import { Header } from "@/components/shared";
import { AddSource, SourceList } from "@/features/source/component";
import { TopbarContent } from "@/layout";

const Page = () => (
  <>
    <TopbarContent position="left">
      <Header title="My Sources" />
    </TopbarContent>

    <TopbarContent position="right">
      <AddSource />
    </TopbarContent>

    {/* <SourceList /> */}
  </>
);

export default Page;
