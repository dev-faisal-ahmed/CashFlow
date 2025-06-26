import { getToken } from "@/lib/server-action";

const Page = async () => {
  const token = await getToken();

  return <div>{token}</div>;
};

export default Page;
