'use client';

import { AuthGuard, UserMenu } from '@/components/auth';
import { useState, useEffect } from 'react';
import { managementApi, type UserProfile } from '@/lib/management-api';
import FirstTimeUserDashboard from '@/components/dashboard/FirstTimeUserDashboard';
import ReturningUserDashboard from '@/components/dashboard/ReturningUserDashboard';
import { Plus, FileText } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}

function DashboardContent() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const profile = await managementApi.user.getProfile();
      setUserProfile(profile);
    } catch (error) {
      console.error('Failed to load user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-background min-h-screen">
        {/* Header */}
        <header className="border-border bg-card border-b">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center gap-8">
                <Link href="/dashboard" className="text-card-foreground text-xl font-semibold hover:text-primary transition-colors">
                  Docko
                </Link>

                {/* Navigation Links */}
                <nav className="hidden md:flex items-center gap-6">
                  <Link
                    href="/documents"
                    className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Documents
                  </Link>
                </nav>
              </div>

              <div className="flex items-center gap-4">
                <Link
                  href="/generate/upload"
                  className={cn(buttonVariants(), "flex items-center gap-2")}
                >
                  <Plus className="h-4 w-4" />
                  Generate Document
                </Link>

                <UserMenu />
              </div>
            </div>
          </div>
        </header>

        {/* Loading Content - Skeleton */}
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Welcome Section Skeleton */}
          <div className="mb-8">
            <Skeleton className="h-9 w-64 mb-2" />
            <Skeleton className="h-5 w-96 mb-6" />
            <div className="flex gap-4">
              <Skeleton className="h-11 w-44" />
              <Skeleton className="h-11 w-44" />
            </div>
          </div>

          {/* Main Grid Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Templates Section - 2 columns */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-9 w-20" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Card key={i}>
                        <CardHeader className="pb-3">
                          <Skeleton className="h-5 w-36" />
                          <div className="flex items-center gap-2 mt-2">
                            <Skeleton className="h-3 w-24" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <Skeleton className="h-9 w-full" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Skeleton */}
            <div className="space-y-6">
              {/* Recent Documents */}
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-40" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-3 p-2">
                        <Skeleton className="h-4 w-4" />
                        <div className="flex-1">
                          <Skeleton className="h-4 w-32 mb-1" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Usage Stats */}
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-28" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-12" />
                      </div>
                    ))}
                    <Skeleton className="h-9 w-full mt-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Error state
  if (!userProfile) {
    return (
      <div className="bg-background min-h-screen">
        {/* Header */}
        <header className="border-border bg-card border-b">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center gap-8">
                <Link href="/dashboard" className="text-card-foreground text-xl font-semibold hover:text-primary transition-colors">
                  Docko
                </Link>

                {/* Navigation Links */}
                <nav className="hidden md:flex items-center gap-6">
                  <Link
                    href="/documents"
                    className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Documents
                  </Link>
                </nav>
              </div>

              <div className="flex items-center gap-4">
                <Link
                  href="/generate/upload"
                  className={cn(buttonVariants(), "flex items-center gap-2")}
                >
                  <Plus className="h-4 w-4" />
                  Generate Document
                </Link>

                <UserMenu />
              </div>
            </div>
          </div>
        </header>

        {/* Error Content */}
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Failed to load dashboard. Please try refreshing the page.</p>
          </div>
        </main>
      </div>
    );
  }

  // Render appropriate dashboard based on user state
  switch (userProfile.dashboard_state) {
    case 'first_time_user':
      return (
        <div>
          {/* Header */}
          <header className="border-border bg-card border-b">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center gap-8">
                  <Link href="/dashboard" className="text-card-foreground text-xl font-semibold hover:text-primary transition-colors">
                    Docko
                  </Link>

                  {/* Navigation Links */}
                  <nav className="hidden md:flex items-center gap-6">
                    <Link
                      href="/documents"
                      className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      Documents
                    </Link>
                  </nav>
                </div>

                <div className="flex items-center gap-4">
                  <Link
                    href="/generate/upload"
                    className={cn(buttonVariants(), "flex items-center gap-2")}
                  >
                    <Plus className="h-4 w-4" />
                    Upload Template
                  </Link>

                  <UserMenu />
                </div>
              </div>
            </div>
          </header>
          <FirstTimeUserDashboard />
        </div>
      );

    case 'has_templates_no_docs':
    case 'returning_user':
      return (
        <div>
          {/* Header */}
          <header className="border-border bg-card border-b">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center gap-8">
                  <Link href="/dashboard" className="text-card-foreground text-xl font-semibold hover:text-primary transition-colors">
                    Docko
                  </Link>

                  {/* Navigation Links */}
                  <nav className="hidden md:flex items-center gap-6">
                    <Link
                      href="/documents"
                      className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      Documents
                    </Link>
                    <Link
                      href="/templates"
                      className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      Templates
                    </Link>
                  </nav>
                </div>

                <div className="flex items-center gap-4">
            

                  <UserMenu />
                </div>
              </div>
            </div>
          </header>
          <ReturningUserDashboard
            user={userProfile.user}
            stats={userProfile.stats}
            recentTemplates={userProfile.recent_templates}
            recentDocuments={userProfile.recent_documents}
          />
        </div>
      );

    default:
      return (
        <div>
          {/* Header */}
          <header className="border-border bg-card border-b">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center gap-8">
                  <Link href="/dashboard" className="text-card-foreground text-xl font-semibold hover:text-primary transition-colors">
                    Docko
                  </Link>

                  {/* Navigation Links */}
                  <nav className="hidden md:flex items-center gap-6">
                    <Link
                      href="/documents"
                      className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      Documents
                    </Link>
                  </nav>
                </div>

                <div className="flex items-center gap-4">
                  <Link
                    href="/generate/upload"
                    className={cn(buttonVariants(), "flex items-center gap-2")}
                  >
                    <Plus className="h-4 w-4" />
                    Upload Template
                  </Link>

                  <UserMenu />
                </div>
              </div>
            </div>
          </header>
          <FirstTimeUserDashboard />
        </div>
      );
  }
}
