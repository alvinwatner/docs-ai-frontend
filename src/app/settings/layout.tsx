'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, CreditCard, ArrowLeft } from 'lucide-react';

interface SettingsLayoutProps {
  children: ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const router = useRouter();

  const navigationItems = [
    {
      name: 'Profile',
      href: '/settings/profile',
      icon: User,
      description: 'Manage your account settings'
    },
    {
      name: 'Billing & Plans',
      href: '/settings/billing',
      icon: CreditCard,
      description: 'Subscription and usage'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="mt-1 text-gray-600">
            Manage your account preferences and subscription
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="group flex items-start p-3 rounded-lg transition-colors hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200"
                  >
                    <Icon className="w-5 h-5 text-gray-400 group-hover:text-gray-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-gray-900 group-hover:text-gray-700">
                        {item.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {item.description}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}