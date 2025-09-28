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

        {/* Loading Content */}
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your dashboard...</p>
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
