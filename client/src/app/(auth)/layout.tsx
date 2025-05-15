import Link from "next/link";

import { AppLogo } from "@/components/shared/app-logo";
import { CommonAvatar } from "@/components/shared/common-avatar";
import { IoIosStar } from "react-icons/io";
import { PropsWithChildren } from "react";

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <main className="flex h-dvh">
      <section className="hidden max-w-120 min-w-100 bg-gradient-to-b from-blue-800 to-blue-700 p-6 text-neutral-200 lg:flex lg:flex-col">
        <Link href="/">
          <AppLogo className="" />
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
}

const review = {
  userName: "Faisal Ahmed",
  rating: 4.9,
};

const ReviewCard = () => (
  <div className="mt-auto rounded-lg border border-blue-800 bg-blue-800/50 p-6 shadow-sm">
    <h1 className="font-semibold">This app changed how I manage my money</h1>
    <p className="mt-4 text-sm font-thin">
      I used to lose track of my expenses and loans all the time. Now everything is clear — I know where my money is, what I owe, and what’s
      coming in. It even suggests where I can cut costs!
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
