import { Spinner } from "@/components/ui/spinner";

const Loading = () => {
  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col items-center justify-center">
      <Spinner />
    </div>
  );
};

export default Loading;
