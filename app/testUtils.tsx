import type { RenderOptions, RenderResult } from "@testing-library/react";
import type { PropsWithChildren, ReactElement } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render as tlRender } from "@testing-library/react";

import { Toaster } from "./components/ui/sonner";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

function TestProviders({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster />
    </QueryClientProvider>
  );
}

export function render(
  component: ReactElement,
  options?: RenderOptions,
): RenderResult {
  return tlRender(component, { wrapper: TestProviders, ...options });
}
