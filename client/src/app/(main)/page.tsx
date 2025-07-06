import { TopbarContent } from "@/layout/index";
import { Header } from "@/components/shared";

const Page = async () => {
  return (
    <>
      <TopbarContent position="left">
        <Header title="Dashboard" />
      </TopbarContent>
    </>
  );
};

export default Page;
