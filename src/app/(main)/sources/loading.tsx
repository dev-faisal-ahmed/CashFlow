import { SourceListSkeleton } from "@/source/component";

const Loading = () => {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <SourceListSkeleton size={6} />
    </section>
  );
};

export default Loading;
