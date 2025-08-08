import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

//QueryClient: The main object that manages the cache, background fetching, and all React Query behavior.
//QueryClientProvider: A context provider component that gives React components access to the QueryClient (just like a Redux Provider or Context Provider).

const ReactQueryWrapper = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1, //Retry failed queries 1 times before throwing an error.
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        // retryDelay: Controls the time between retries. This uses exponential backoff:
        // On first retry: 1000 ms (1 sec)
        // On second retry: 2000 ms
        // Capped at 30,000 ms (30 seconds)
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default ReactQueryWrapper;
