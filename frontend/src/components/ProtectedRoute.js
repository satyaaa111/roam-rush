'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { FullPageSpinner } from '@/components/ui/FullPageSpinner';

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
    return <FullPageSpinner />;
  }

  // If verified, show content
  if (user) {
    return <>{children}</>;
  }

  return null;
}