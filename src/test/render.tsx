import type { PropsWithChildren, ReactElement } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, type RenderOptions } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const safeAreaMetrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, right: 0, bottom: 34, left: 0 },
};

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: Infinity },
      mutations: { retry: false },
    },
  });
}

type Options = Omit<RenderOptions, 'wrapper'> & { queryClient?: QueryClient };

/** Renders with the app providers. Theme follows useColorScheme, so no provider is needed for it. */
export async function renderWithProviders(
  ui: ReactElement,
  { queryClient = createTestQueryClient(), ...options }: Options = {},
) {
  function Wrapper({ children }: PropsWithChildren) {
    return (
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider initialMetrics={safeAreaMetrics}>{children}</SafeAreaProvider>
      </QueryClientProvider>
    );
  }

  const result = await render(ui, { wrapper: Wrapper, ...options });

  return { queryClient, ...result };
}

export * from '@testing-library/react-native';
