'use client';

import { useUser } from '@auth0/nextjs-auth0';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export function AuthGuard({
  children,
  redirectTo = '/auth/login',
  fallback,
}: AuthGuardProps) {
  const { user, error, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user && !error) {
      // Store the current URL to redirect back after login
      const returnTo = encodeURIComponent(window.location.pathname + window.location.search);
      router.push(`${redirectTo}?returnTo=${returnTo}`);
    }
  }, [user, isLoading, error, redirectTo, router]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      fallback || (
        <div className="flex h-screen items-center justify-center">
          <LoadingSpinner size="lg" label="Loading..." />
        </div>
      )
    );
  }

  // Show error state if there's an authentication error
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-error mb-2">Authentication Error</h2>
          <p className="text-muted-foreground mb-4">{error.message}</p>
          <button
            onClick={() => router.push('/auth/login')}
            className="text-primary hover:text-primary-hover"
          >
            Try signing in again
          </button>
        </div>
      </div>
    );
  }

  // Don't render children if user is not authenticated
  if (!user) {
    return null;
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
}