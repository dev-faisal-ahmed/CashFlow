import { WalletListSkeleton } from "@/features/wallet/components/wallet-loading";

const Loading = () => {
  return (
    <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <WalletListSkeleton size={8} />
    </section>
  );
};

export default Loading;
