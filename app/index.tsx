import { Redirect } from 'expo-router';
import { useUserStore } from '@/store/useUserStore';

export default function Index() {
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);

  if (isLoggedIn) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/login" />;
}
