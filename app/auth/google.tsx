import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function GoogleAuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/sign-in');
    }
  }, [router]);

  return null;
}
