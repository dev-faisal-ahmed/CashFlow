"use client";

import { errorToast } from "@/lib/utils";
import { DefaultError, isServer, MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PropsWithChildren } from "react";

const onGlobalQueryError = (error: DefaultError, query: unknown) => {
  if (error instanceof Error) {
    console.error("Global: Query failed:", "\nName:", error.name, "\nCause:", error.cause, "\nMessage:", error.message, "\nQuery:", query);
  } else {
    console.error("Global: Unknown query error", error);
  }
};

const onGlobalMutationError = (error: DefaultError, mutation: unknown) => {
  if (!isServer) errorToast(error);

  if (error instanceof Error) {
    console.error(
      "Global: Mutation failed:",
      "\nName:",
      error.name,
      "\nCause:",
      error.cause,
      "\nMessage:",
      error.message,
      "\nMutation:",
      mutation,
    );
  } else {
    console.error("Global: Unknown mutation error", error);
  }
};

const TIME = 20 * 60 * 1000;

const makeQueryClient = () => {
  return new QueryClient({
    defaultOptions: { queries: { staleTime: TIME } },
    queryCache: new QueryCache({ onError: onGlobalQueryError }),
    mutationCache: new MutationCache({ onError: onGlobalMutationError }),
  });
};

let browserQueryClient: QueryClient | undefined = undefined;

const getQueryClient = () => {
  if (isServer) return makeQueryClient();
  else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
};

export const QueryProvider = ({ children }: PropsWithChildren) => {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} position="bottom" buttonPosition="bottom-right" />
      {children}
    </QueryClientProvider>
  );
};
