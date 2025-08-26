import { Header } from "@/components/shared";
import { AddCategory, CategoryList } from "@/category/components";
import { TopbarContent } from "@/layout";

const Page = () => (
  <>
    <TopbarContent position="left">
      <Header title="My Categories" />
    </TopbarContent>

    <TopbarContent position="right">
      <AddCategory />
    </TopbarContent>

    <CategoryList />
  </>
);

export default Page;
