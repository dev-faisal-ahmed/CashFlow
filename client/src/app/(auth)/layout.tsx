import Link from "next/link";

import { IoIosStar } from "react-icons/io";
import { FC, PropsWithChildren } from "react";
import { AppLogo, CommonAvatar } from "@/components/shared";
import { getLoggedUser } from "@/lib/server-action";
import { redirect } from "next/navigation";

// Main Component
const Layout: FC<PropsWithChildren> = async ({ children }) => {
  const user = await getLoggedUser();
  if (user) redirect("/");

  return (
    <main className="flex h-dvh items-center md:h-screen">
      <section className="hidden h-screen w-[40%] bg-gradient-to-b from-blue-800 to-blue-700 p-6 text-neutral-200 lg:flex lg:flex-col">
        <Link href="/">
          <AppLogo descriptionClassName="text-white/70" />
        </Link>
        <div className="mt-20">
          <h1 className="text-4xl leading-12 font-semibold tracking-wider">Track, analyze, and control your money effortlessly.</h1>
          <p className="mt-6 font-thin">
            From daily expenses to income insights, borrowing and lending to category-based analytics — manage your entire financial life
            from one powerful dashboard. Whether you&apos;re budgeting smarter or just trying to see where your money goes, we&apos;ve got
            you covered.
          </p>
        </div>
        <ReviewCard />
      </section>
      <section className="grow">{children}</section>
    </main>
  );
};

// Helper Component
const review = {
  userName: "Faisal Ahmed",
  rating: 4.9,
};

const ReviewCard = () => (
  <div className="mt-auto rounded-md border border-blue-800 bg-blue-800/50 p-6 shadow-sm">
    <h1 className="font-semibold">This app changed how I manage my money</h1>
    <p className="mt-4 text-sm font-thin">
      I used to lose track of my expenses and loans all the time. Now everything is clear — I know where my money is, what I owe, and
      what&apos;s coming in. It even suggests where I can cut costs!
    </p>
    <div className="mt-6 flex items-center gap-4">
      <CommonAvatar name={review.userName} size="SM" />
      <h2 className="font-semibold">{review.userName}</h2>
      <p className="ml-auto flex items-center gap-2 font-bold text-yellow-400">
        {review.rating}/5 <IoIosStar />
      </p>
    </div>
  </div>
);

// Exports
export default Layout;
