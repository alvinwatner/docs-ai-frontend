'use client';

import { useUser } from '@auth0/nextjs-auth0';
import { AuthGuard, UserMenu } from '@/components/auth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Plus, FileText, Clock, HelpCircle, Settings, X, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}

function DashboardContent() {
  const { user } = useUser();
  const [showGettingStarted, setShowGettingStarted] = useState(true);

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
                <Link 
                  href="/help" 
                  className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <HelpCircle className="h-4 w-4" />
                  Help
                </Link>
              </nav>
            </div>
            
            <div className="flex items-center gap-4">
              <Link 
                href="/generate/upload" 
                className={cn(buttonVariants(), "flex items-center gap-2")}
              >
                <Plus className="h-4 w-4" />
                New Document
              </Link>
              
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Getting Started Tips - Dismissible */}
        {showGettingStarted && (
          <div className="mb-8 rounded-lg bg-primary/5 border border-primary/20 p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Welcome to Docko! 🎉
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Generate professional documents in 3 simple steps:
                  </p>
                  <ol className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground font-medium">1</span>
                      Upload your DOCX template with {`{{variable}}`} placeholders
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground font-medium">2</span>
                      Fill in your custom values for each variable
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground font-medium">3</span>
                      Download your personalized document (DOCX or PDF)
                    </li>
                  </ol>
                  <div className="mt-4 flex items-center gap-3">
                    <Link 
                      href="/generate/upload"
                      className={cn(buttonVariants({ size: "sm" }))}
                    >
                      <Plus className="h-4 w-4" />
                      Create Your First Document
                    </Link>
                    <Link 
                      href="/help/getting-started"
                      className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowGettingStarted(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Welcome Message */}
        <div className="mb-8">
          <h2 className="text-foreground mb-2 text-2xl font-semibold">
            Welcome back, {user?.name?.split(' ')[0] || 'there'}!
          </h2>
          <p className="text-muted-foreground">
            Ready to create your next document? Upload a template to get started.
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* View Documents */}
          <Card className="hover:bg-accent cursor-pointer transition-colors">
            <Link href="/documents">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="text-primary h-5 w-5" />
                  My Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  View and download your previously generated documents.
                </p>
              </CardContent>
            </Link>
          </Card>

          {/* Help & Support */}
          <Card className="hover:bg-accent cursor-pointer transition-colors">
            <Link href="/help">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <HelpCircle className="text-primary h-5 w-5" />
                  Get Help
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Learn how to create templates and use advanced features.
                </p>
              </CardContent>
            </Link>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground py-8 text-center">
                <FileText className="mx-auto mb-4 h-12 w-12 opacity-50" />
                <p>No documents yet</p>
                <p className="text-sm">
                  Create your first document to see it appear here.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Usage Stats */}
          <Card>
            <CardHeader>
              <CardTitle>This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">
                    Documents Created
                  </span>
                  <span className="font-medium">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Plan</span>
                  <span className="font-medium">Free</span>
                </div>
                <div className="pt-4">
                  <Link 
                    href="/settings/billing"
                    className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                  >
                    View Usage Details
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
