import type { PropsWithChildren } from 'react';
import { Text } from 'react-native';

const actual = jest.requireActual<typeof import('expo-router')>('expo-router');

export const { DefaultTheme, DarkTheme, ThemeProvider } = actual;
export const Redirect = () => null;

export const router = {
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  navigate: jest.fn(),
  dismiss: jest.fn(),
  canGoBack: jest.fn(() => true),
  setParams: jest.fn(),
};

export const useRouter = () => router;
export const useLocalSearchParams = jest.fn(() => ({}));
export const useSegments = jest.fn(() => []);
export const usePathname = jest.fn(() => '/');

type LinkProps = PropsWithChildren<{ href: unknown; asChild?: boolean }>;

export function Link({ children, href: _href, asChild: _asChild, ...props }: LinkProps) {
  return <Text {...props}>{children}</Text>;
}

export const Stack = Object.assign(() => null, { Screen: () => null });
export const Tabs = Object.assign(() => null, { Screen: () => null });
