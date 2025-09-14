import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function IndexScreen() {
  const router = useRouter();

  useEffect(() => {
    // Immediately redirect to splash screen
    router.replace('/splash');
  }, []);

  return null;
}