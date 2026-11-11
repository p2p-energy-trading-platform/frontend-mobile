import { useAppStore } from '@/store/app-store';

jest.mock('react-native-worklets', () => require('react-native-worklets/src/mock'));
require('react-native-reanimated').setUpTests();

jest.mock('expo-router', () => require('./src/test/mocks/expo-router'));

jest.mock(
  'expo-secure-store',
  () => {
    const store = new Map<string, string>();

    return {
      getItemAsync: jest.fn(async (key: string) => store.get(key) ?? null),
      setItemAsync: jest.fn(async (key: string, value: string) => {
        store.set(key, value);
      }),
      deleteItemAsync: jest.fn(async (key: string) => {
        store.delete(key);
      }),
      __reset: () => store.clear(),
    };
  },
  { virtual: true },
);

afterEach(() => {
  useAppStore.getState().reset();
  require('expo-secure-store').__reset();
  jest.clearAllMocks();
});
