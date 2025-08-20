import { TopbarContent } from "@/layout/index";
import { Header } from "@/components/shared";
import { getAuth } from "@/auth/auth.action";

const Page = async () => {
  const user = await getAuth();

  return (
    <>
      <TopbarContent position="left">
        <Header title="Dashboard" />
      </TopbarContent>

      <div className="break-all">{JSON.stringify(user)}</div>
    </>
  );
};

export default Page;
