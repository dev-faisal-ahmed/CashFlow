import { SignupForm } from "./signup-form";

export default function Page() {
  return (
    <div className="mx-auto flex max-w-200 flex-col p-20">
      <h2 className="mb-12 text-2xl font-semibold">Let&apos;s get started</h2>
      <SignupForm />
    </div>
  );
}
