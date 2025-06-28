import { TopbarContent } from "@/components/layout/app-topbar";
import { Header } from "@/components/shared/header";

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
