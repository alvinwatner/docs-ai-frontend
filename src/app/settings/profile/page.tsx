'use client';

import { useUser } from '@auth0/nextjs-auth0';
import { User, Mail, Calendar, Shield } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

export default function ProfilePage() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="p-6">
        {/* Header Skeleton */}
        <div className="mb-6">
          <Skeleton className="h-7 w-40 mb-2" />
          <Skeleton className="h-5 w-72" />
        </div>

        <div className="space-y-6">
          {/* Profile Information Skeleton */}
          <div className="bg-gray-50 rounded-lg p-6">
            <Skeleton className="h-6 w-44 mb-4" />
            <div className="space-y-4">
              {/* Profile Picture & Name */}
              <div className="flex items-center space-x-4">
                <Skeleton className="w-16 h-16 rounded-full" />
                <div>
                  <Skeleton className="h-6 w-36 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              {/* Contact Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-white rounded border">
                  <Skeleton className="w-5 h-5" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-12 mb-1" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white rounded border">
                  <Skeleton className="w-5 h-5" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Account Details Skeleton */}
          <div className="bg-gray-50 rounded-lg p-6">
            <Skeleton className="h-6 w-36 mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center py-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          </div>

          {/* Account Actions Skeleton */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <Skeleton className="h-6 w-36 mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="px-4 py-3 rounded-lg border border-gray-200">
                  <Skeleton className="h-5 w-48 mb-2" />
                  <Skeleton className="h-4 w-72" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">Please log in to view your profile</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Profile Settings</h2>
        <p className="text-gray-600 mt-1">
          Manage your account information and preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Information */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>

          <div className="space-y-4">
            {/* Profile Picture & Name */}
            <div className="flex items-center space-x-4">
              {user.picture ? (
                <Image
                  src={'https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250'}
                  alt={user.name || 'Profile picture'}
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-full object-cover border border-gray-200"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <div>
                <h4 className="text-lg font-medium text-gray-900">
                  {user.name || 'Unknown User'}
                </h4>
                <p className="text-sm text-gray-600">
                  {user.nickname || 'No nickname set'}
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-white rounded border">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-sm font-medium text-gray-700">Email</div>
                  <div className="text-sm text-gray-600">
                    {user.email || 'No email provided'}
                  </div>
                  {user.email_verified && (
                    <div className="inline-flex items-center text-xs text-green-600 mt-1">
                      <Shield className="w-3 h-3 mr-1" />
                      Verified
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-white rounded border">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-sm font-medium text-gray-700">Member Since</div>
                  <div className="text-sm text-gray-600">
                    {user.updated_at ? formatDate(user.updated_at) : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Details */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Account Details</h3>

          <div className="space-y-3">
            <div className="flex justify-between items-center py-2">
              <span className="text-sm font-medium text-gray-700">User ID</span>
              <span className="text-sm text-gray-600 font-mono">
                {user.sub?.slice(-8) || 'N/A'}
              </span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-sm font-medium text-gray-700">Login Method</span>
              <span className="text-sm text-gray-600">
                {user.sub?.includes('google') ? 'Google' :
                 user.sub?.includes('github') ? 'GitHub' :
                 user.sub?.includes('auth0') ? 'Email/Password' : 'Other'}
              </span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-sm font-medium text-gray-700">Last Login</span>
              <span className="text-sm text-gray-600">
                {user.updated_at ? formatDate(user.updated_at) : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Account Actions</h3>

          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="font-medium text-gray-900">Update Profile Information</div>
              <div className="text-sm text-gray-600 mt-1">
                Change your name, email, and other basic information
              </div>
            </button>

            <button className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="font-medium text-gray-900">Change Password</div>
              <div className="text-sm text-gray-600 mt-1">
                Update your account password for better security
              </div>
            </button>

            <button className="w-full text-left px-4 py-3 rounded-lg border border-red-200 hover:bg-red-50 transition-colors text-red-600">
              <div className="font-medium">Delete Account</div>
              <div className="text-sm text-red-500 mt-1">
                Permanently delete your account and all associated data
              </div>
            </button>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="text-xs text-gray-500 text-center">
          Your personal information is secure and will never be shared with third parties.
          Read our{' '}
          <a href="/privacy" className="text-blue-600 hover:text-blue-700">
            Privacy Policy
          </a>{' '}
          for more details.
        </div>
      </div>
    </div>
  );
}