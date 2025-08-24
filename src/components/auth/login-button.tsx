'use client';

import { useUser } from '@auth0/nextjs-auth0';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

interface LoginButtonProps {
  returnTo?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function LoginButton({
  returnTo,
  className,
  variant = 'primary',
  size = 'md',
}: LoginButtonProps) {
  const { user, isLoading } = useUser();

  // Don't show login button if user is already logged in
  if (user) return null;

  const handleLogin = () => {
    const loginUrl = `/auth/login${returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ''}`;
    window.location.href = loginUrl;
  };

  return (
    <Button
      onClick={handleLogin}
      disabled={isLoading}
      loading={isLoading}
      variant={variant}
      size={size}
      className={className}
    >
      <LogIn className="h-4 w-4" />
      Sign In
    </Button>
  );
}