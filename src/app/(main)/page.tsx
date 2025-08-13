import { TopbarContent } from "@/layout/index";
import { Header } from "@/components/shared";
import { getToken } from "@/lib/server-action";

const Page = async () => {
  const token = await getToken();

  return (
    <>
      <TopbarContent position="left">
        <Header title="Dashboard" />
      </TopbarContent>
      
      <div className="break-all">{JSON.stringify(token)}</div>
    </>
  );
};

export default Page;
