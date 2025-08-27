import { Header } from "@/components/shared";
import { AddCategory, AllCategories } from "@/category/components";
import { TopbarContent } from "@/layout";

const Page = () => (
  <>
    <TopbarContent position="left">
      <Header title="My Categories" />
    </TopbarContent>

    <TopbarContent position="right">
      <AddCategory />
    </TopbarContent>

    <AllCategories />
  </>
);

export default Page;
