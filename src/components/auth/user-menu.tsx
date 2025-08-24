'use client';

import { useUser } from '@auth0/nextjs-auth0';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

export function UserMenu() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Menu as="div" className="relative inline-block text-left">
      <MenuButton as={Button} variant="ghost" size="sm" className="flex items-center gap-2">
        {user.picture ? (
          <Image
            src={'https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250'}
            alt={user.name || 'User avatar'}
            width={24}
            height={24}
            className="h-6 w-6 rounded-full"
          />
        ) : (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <User className="h-4 w-4" />
          </div>
        )}
        <span className="hidden text-sm font-medium sm:inline-block">
          {user.name?.split(' ')[0] || 'User'}
        </span>
        <ChevronDown className="h-4 w-4" />
      </MenuButton>

      <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md border border-border bg-card shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className="p-1">
          {/* User Info */}
          <div className="px-3 py-2 text-sm border-b border-border mb-1">
            <p className="font-medium text-card-foreground">{user.name}</p>
            <p className="text-muted-foreground truncate">{user.email}</p>
          </div>

          {/* Profile Link */}
          <MenuItem>
            {({ focus }) => (
              <Link
                href="/settings/profile"
                className={`${
                  focus ? 'bg-accent text-accent-foreground' : 'text-card-foreground'
                } group flex w-full items-center rounded-md px-3 py-2 text-sm`}
              >
                <User className="mr-3 h-4 w-4" />
                Profile Settings
              </Link>
            )}
          </MenuItem>

          {/* Billing Link */}
          <MenuItem>
            {({ focus }) => (
              <Link
                href="/settings/billing"
                className={`${
                  focus ? 'bg-accent text-accent-foreground' : 'text-card-foreground'
                } group flex w-full items-center rounded-md px-3 py-2 text-sm`}
              >
                <Settings className="mr-3 h-4 w-4" />
                Billing & Usage
              </Link>
            )}
          </MenuItem>

          {/* Divider */}
          <div className="my-1 border-t border-border" />

          {/* Logout */}
          <MenuItem>
            {({ focus }) => (
              <button
                onClick={() => (window.location.href = '/auth/logout')}
                className={`${
                  focus ? 'bg-accent text-accent-foreground' : 'text-card-foreground'
                } group flex w-full items-center rounded-md px-3 py-2 text-sm`}
              >
                <LogOut className="mr-3 h-4 w-4" />
                Sign Out
              </button>
            )}
          </MenuItem>
        </div>
      </MenuItems>
    </Menu>
  );
}