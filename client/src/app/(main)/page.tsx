import { getToken } from "@/lib/server-action";
import { jwtDecode } from "jwt-decode";
import { redirect } from "next/navigation";

const Page = async () => {
  const token = await getToken();
  if (!token) redirect("/login");
  const user = jwtDecode(token);

  return <div className="break-all">{JSON.stringify(user)}</div>;
};

export default Page;
