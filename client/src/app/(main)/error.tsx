"use client";

import { FC, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { VscBracketError } from "react-icons/vsc";

type ErrorProps = { error: Error & { digest?: string }; reset: () => void };

const GlobalError: FC<ErrorProps> = ({ error, reset }) => {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <section className="flex h-[calc(100vh-8rem)] flex-col items-center justify-center px-4 text-center">
      <VscBracketError className="text-destructive mb-4 size-12" />
      
      <h2 className="text-xl text-muted-foreground font-semibold">Something went wrong.</h2>
      <p className="mt-2 text-sm text-muted-foreground">{error.message || "An unexpected error occurred."}</p>
      <Button onClick={reset} className="mt-6" variant="outline" size="sm">
        Try Again
      </Button>
    </section>
  );
};

export default GlobalError;
