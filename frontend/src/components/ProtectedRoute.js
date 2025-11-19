'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if we are NOT loading and have NO user
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Show nothing (or a spinner) while loading
  if (loading) {
    return <div>Loading...</div>; // Or your <Spinner /> component
  }

  // If verified, show content
  if (user) {
    return <>{children}</>;
  }

  return null;
}