import { useRouter } from 'expo-router';

/** Goes back to the previous screen; falls back to Home when there is no history (e.g. deep link). */
export function useGoBack() {
  const router = useRouter();

  return () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };
}
