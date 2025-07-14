import { Header } from "@/components/shared";
import { AddContact } from "@/contact/components";
import { ContactTable } from "@/features/contact/components/contact-table";
import { TopbarContent } from "@/layout";

// Disable SSR for this page
export const dynamic = "force-dynamic";

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
