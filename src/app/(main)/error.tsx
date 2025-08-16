"use client";

import { FC, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { VscBracketError } from "react-icons/vsc";
import { ZodError } from "zod";

type ErrorProps = { error: Error & { digest?: string }; reset: () => void };

const GlobalError: FC<ErrorProps> = ({ error, reset }) => {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <section className="flex h-[calc(100vh-8rem)] flex-col items-center justify-center p-4 text-center">
      <VscBracketError className="mb-4 size-12" />

      <h2 className="text-muted-foreground text-xl font-semibold">Something went wrong.</h2>
      <p className="text-muted-foreground mt-2 text-sm">{handleError(error) || "An unexpected error occurred."}</p>
      <Button onClick={reset} className="mt-6" variant="outline" size="sm">
        Try Again
      </Button>
    </section>
  );
};

const handleError = (error: unknown) => {
  let message = "An unexpected error occurred.";

  if (error instanceof ZodError) {
    message = error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join(", ");
  } else if (error instanceof Error) {
    message = error.message;
  }

  return message;
};

export default GlobalError;
