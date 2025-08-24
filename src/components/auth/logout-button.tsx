'use client';

import { useUser } from '@auth0/nextjs-auth0';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

interface LogoutButtonProps {
  returnTo?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function LogoutButton({
  returnTo,
  className,
  variant = 'ghost',
  size = 'sm',
}: LogoutButtonProps) {
  const { user, isLoading } = useUser();

  // Don't show logout button if user is not logged in
  if (!user) return null;

  const handleLogout = () => {
    const logoutUrl = `/auth/logout${returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ''}`;
    window.location.href = logoutUrl;
  };

  return (
    <Button
      onClick={handleLogout}
      disabled={isLoading}
      loading={isLoading}
      variant={variant}
      size={size}
      className={className}
    >
      <LogOut className="h-4 w-4" />
      Sign Out
    </Button>
  );
}