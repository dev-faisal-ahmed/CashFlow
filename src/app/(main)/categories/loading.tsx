import { CategoryListSkeleton } from "@/category/components";

const Loading = () => (
  <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <CategoryListSkeleton size={6} />
  </section>
);

export default Loading;
