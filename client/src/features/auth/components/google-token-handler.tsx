"use client";

import { Spinner } from "@/components/ui/spinner";
import { storeToken } from "@/lib/server-action";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export const GoogleTokenHandler = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    const handleStoreToken = async () => {
      if (token) {
        await storeToken(token);
        router.replace("/");
      } else router.replace("/login");
    };

    handleStoreToken();
  }, [token, router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <Spinner />
    </div>
  );
};
