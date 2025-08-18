import { Header } from "@/components/shared";
import { AddContact, ContactTable } from "@/contact/components";
import { TopbarContent } from "@/layout";

const Page = () => (
  <>
    <TopbarContent position="left">
      <Header title="My Contacts" />
    </TopbarContent>
    <TopbarContent position="right">
      <AddContact />
    </TopbarContent>

    <ContactTable />
  </>
);

export default Page;
